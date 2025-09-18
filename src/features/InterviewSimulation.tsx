import { useSearchParams } from "react-router-dom";
import ChatHistory, { type ChatHistoryRef } from "../components/common/ChatHistory";
import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS, WEBSOCKET_TYPES } from "../constants";
import InterviewRecording from "../components/common/InterviewRecording";
import { useVoiceStreaming } from "../hook/useVoiceStreaming";
import { generateSegmentId } from "../utils/generator";
import { Colors } from "../assets/styles";
import ContentLayout from "../components/layout/ContentLayout";
import { useDispatch } from "react-redux";
import { getInterviewSessionInformation } from "../actions/interviewAction";
import { useContextProvider } from "../components/layout/ContextProvider";
const audioQueue: ArrayBuffer[] = [];
let audioPlaying = false;
const audioCtx = new AudioContext();

async function playBinaryAudio(buffer: ArrayBuffer, setIsAiSpeaking: (speaking: boolean) => void, isHeadphonesMuted: boolean, isConnected: boolean) {
    if (!isConnected) {
        console.warn("⚠️ Skipping audio playback - not connected to server");
        audioQueue.length = 0;
        return;
    }

    audioQueue.push(buffer);

    if (!audioPlaying) {
        audioPlaying = true;
        setIsAiSpeaking(true);

        while (audioQueue.length > 0) {
            const currentBuffer = audioQueue.shift()!;

            try {
                const float32:any = convertPCM16ToFloat32(currentBuffer);
                const audioBuffer = audioCtx.createBuffer(
                    1,
                    float32.length,
                    24000
                );
                audioBuffer.copyToChannel(float32, 0);

                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                
                const gainNode = audioCtx.createGain();
                gainNode.gain.value = isHeadphonesMuted ? 0 : 1;
                
                source.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                source.start();

                await new Promise<void>((resolve) => {
                    source.onended = () => resolve();
                });
            } catch (e) {
                console.error("Audio playback failed:", e);
            }
        }

        audioPlaying = false;
        setIsAiSpeaking(false);
    }
}

function convertPCM16ToFloat32(buffer: ArrayBuffer): Float32Array {
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);

    for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768;
    }

    return float32Array;
}

type WebSocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    const [websocketUrl] = useState(`ws://localhost:8080/api/v1/ws/connect/${sessionTokenParam}`);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isHeadphonesMuted, setIsHeadphonesMuted] = useState<boolean>(false);
    const [connectionState, setConnectionState] = useState<WebSocketConnectionState>('connecting');
    const websocketRef = useRef<WebSocket | null>(null);
    const chatHistoryRef = useRef<ChatHistoryRef>(null);
    const dispatch = useDispatch();
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [startTime] = useState<number>(Date.now());
    const { isMobile, isTablet } = useContextProvider();

    const getConnectionStatusMessage = (): string => {
        switch (connectionState) {
            case 'connecting':
                return '🟡 Connecting to Server...';
            case 'connected':
                return '🟢 Connected to Server ✓';
            case 'disconnected':
                return '🔴 Disconnected from Server';
            case 'error':
                return '🔴 Connection error from Server';
            default:
                return '🟡 Connecting to Server...';
        }
    };

    const getConnectionStatusColor = (): string => {
        switch (connectionState) {
            case 'connected':
                return '#4CAF50';
            case 'connecting':
                return '#FF9800';
            case 'disconnected':
            case 'error':
                return '#F44336';
            default:
                return Colors.PRIMARY_COLOR;
        }
    };


    useEffect(() => {
        if (sessionTokenParam) {
            dispatch(getInterviewSessionInformation(sessionTokenParam));
        }
    }, [sessionTokenParam, dispatch]);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [startTime]);

    const handleUserSpeakingChange = useCallback((speaking: boolean) => {
        setIsUserSpeaking(speaking && !isMicMuted);
    }, [isMicMuted]);

    useVoiceStreaming(websocketRef, sessionId, handleUserSpeakingChange, isMicMuted, connectionState === 'connected');

    const handleMicMuteChange = useCallback((isMuted: boolean) => {
        setIsMicMuted(isMuted);
        
        if (isMuted) {
            setIsUserSpeaking(false);
        }
    }, []);

    const handleHeadphoneMuteChange = useCallback((isMuted: boolean) => {
        setIsHeadphonesMuted(isMuted);
    }, []);

    const handleWebSocketMessage = useCallback((response: any) => {
        if (connectionState !== 'connected' && response.type !== WEBSOCKET_TYPES.CONNECTION_ESTABLISHED) {
            return;
        }

        switch (response.type) {
            case WEBSOCKET_TYPES.CONNECTION_ESTABLISHED:
                setSessionId(response.session_id);
                setConnectionState('connected');
                break;
            case WEBSOCKET_TYPES.USER_PARTIAL_TRANSCRIPT:
                chatHistoryRef.current?.handlePartialTranscript(response.segment_id, response.transcript, "user");
                break;
            case WEBSOCKET_TYPES.INTERVIWER_RESPONSE:
                if (sessionId) {
                    const segment_id = generateSegmentId(sessionId);
                    console.log("Received interviewer response", response.message);
                    chatHistoryRef.current?.handlePartialTranscript(segment_id, response.message, "interviewer");
                } else {
                }
                break;
            case "error":
                console.error("Server error:", response.message || response);
                break;
            case "disconnect":
                console.warn("Server disconnect:", response.message || response);
                break;
            default:
                console.warn("Unknown message type:", response);
        }
    }, [sessionId, connectionState]);

    const initializeWebSocket = useCallback(() => {
        try {
            setConnectionState('connecting');
            
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const wsUrl = accessToken
                ? `${websocketUrl}?access_token=${accessToken}`
                : websocketUrl;

            websocketRef.current = new WebSocket(wsUrl);

            websocketRef.current.onopen = () => {
                console.log("WebSocket connection opened");
            };

            websocketRef.current.onclose = (event) => {
                console.log("WebSocket closed:", event.code, event.reason);
                setConnectionState('disconnected');
                setSessionId(null);
                
                console.log("Connection closed. Use the reconnect button to reconnect manually.");
            };

            websocketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setConnectionState('error');
            };

            websocketRef.current.onmessage = async (event) => {
                try {
                    if (event.data instanceof Blob) {
                        console.log("Received audio blob");
                        const buffer = await event.data.arrayBuffer();
                        const view = new DataView(buffer);
                
                        const headerLength = view.getUint32(0, false);
                        const headerBytes = new Uint8Array(buffer.slice(4, 4 + headerLength));
                        const headerJson = new TextDecoder("utf-8").decode(headerBytes);
                        const header = JSON.parse(headerJson);
                
                        const audioData = buffer.slice(4 + headerLength);
                        console.log("header", header);
                
                        if (header.type === WEBSOCKET_TYPES.INTERVIEWER_AUDIO_CHUNKING) {
                            console.log("Playing audio data");
                            await playBinaryAudio(audioData, setIsAiSpeaking, isHeadphonesMuted, connectionState === 'connected');
                        }
                    } else {
                        const data = JSON.parse(event.data);
                        handleWebSocketMessage(data);
                    }
                } catch (error) {
                    console.error("Failed to handle WebSocket message:", error);
                }
            };
        } catch (error) {
            console.error("Failed to initialize WebSocket:", error);
        }
    }, [websocketUrl, handleWebSocketMessage]);

    const handleManualReconnect = useCallback(() => {
        if (websocketRef.current) {
            websocketRef.current.close();
        }

        initializeWebSocket();
    }, []);

    useEffect(() => {
        initializeWebSocket();

        return () => {
            websocketRef.current?.close();
            websocketRef.current = null;
        };
    }, []);

    return (
        <ContentLayout>
            <div style={{ width: '100%', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', padding: '20px 20px 0 20px' }}>
                    <div style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontWeight: '600',
                        color: Colors.PRIMARY_COLOR,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px'
                    }}>
                        <div>
                            General Interview With AI
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 20px 5px 20px' }}>
                    <div style={{
                        fontSize: isMobile ? '12px' : '15px',
                        color: getConnectionStatusColor(),
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div>
                            {getConnectionStatusMessage()}
                        </div>
                        {(connectionState === 'connecting') && (
                            <div style={{
                                width: '12px',
                                height: '12px',
                                border: '2px solid transparent',
                                borderTop: `2px solid ${getConnectionStatusColor()}`,
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                        )}
                    </div>
                </div>

                <div style={{borderBottom: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`}}></div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: isMobile ? '80%' : isTablet ? '70%' : '60%'}}>
                        <InterviewRecording
                            websocketUrl={websocketUrl}
                            sessionToken={sessionTokenParam || ''}
                            isAiSpeaking={isAiSpeaking}
                            isUserSpeaking={isUserSpeaking}
                            onMicMuteChange={handleMicMuteChange}
                            onHeadphoneMuteChange={handleHeadphoneMuteChange}
                            onReconnect={handleManualReconnect}
                            websocketRef={websocketRef}
                            elapsedTime={elapsedTime}
                            isConnected={connectionState === 'connected'}
                        />
                    </div>
                    <div style={{ width: isMobile ? '80%' : isTablet ? '70%' : '60%', overflow: 'hidden' }}>
                        <ChatHistory ref={chatHistoryRef} session_token={sessionTokenParam || ''} />
                    </div>
                </div>
                    
            </div>
        </ContentLayout>
    );
};

export default InterviewSimulation;
