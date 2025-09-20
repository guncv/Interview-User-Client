import { useSearchParams } from "react-router-dom";
import ChatHistory, { type ChatHistoryRef } from "../components/common/ChatHistory";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACTOR, CONVERSATION_STATUS, STORAGE_KEYS, WEBSOCKET_TYPES } from "../constants";
import InterviewRecording from "../components/common/InterviewRecording";
import { useVoiceStreaming } from "../hook/useVoiceStreaming";
import { Colors } from "../assets/styles";
import ContentLayout from "../components/layout/ContentLayout";
import { useDispatch } from "react-redux";
import { getInterviewSessionInformation } from "../actions/interviewAction";
import { useContextProvider } from "../components/layout/ContextProvider";

let audioChunks: ArrayBuffer[] = [];
let isPlaying = false;

async function playBufferedAudio(
    chunk: ArrayBuffer,
    setIsAiSpeaking: (speaking: boolean) => void,
    isHeadphonesMuted: boolean,
    isConnected: boolean
    ) {
    if (!isConnected) return;

    audioChunks.push(chunk);

    if (isPlaying) return;

    isPlaying = true;
    setIsAiSpeaking(true);

    await new Promise((res) => setTimeout(res, 300));

    const fullBlob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
    audioChunks = [];

    const url = URL.createObjectURL(fullBlob);
    const audio = new Audio(url);
    audio.volume = isHeadphonesMuted ? 0 : 1;

    await new Promise<void>((resolve) => {
        audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
        };
        audio.onerror = (err) => {
        console.error("Audio playback error:", err);
        URL.revokeObjectURL(url);
        resolve();
        };
        audio.play().catch((e) => {
        console.error("Audio play() failed:", e);
        URL.revokeObjectURL(url);
        resolve();
        });
    });

    isPlaying = false;
    setIsAiSpeaking(false);
}


type WebSocketConnectionState =typeof CONVERSATION_STATUS.CONNECTING | typeof CONVERSATION_STATUS.CONNECTED | typeof CONVERSATION_STATUS.DISCONNECTED | typeof CONVERSATION_STATUS.ERROR;

const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    const [websocketUrl] = useState(`ws://localhost:8080/api/v1/ws/connect/${sessionTokenParam}`);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isHeadphonesMuted, setIsHeadphonesMuted] = useState<boolean>(false);
    const [connectionState, setConnectionState] = useState<WebSocketConnectionState>(CONVERSATION_STATUS.CONNECTING);
    const websocketRef = useRef<WebSocket | null>(null);
    const chatHistoryRef = useRef<ChatHistoryRef>(null);
    const dispatch = useDispatch();
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [serverStartTime, setServerStartTime] = useState<string | null>(null);
    const [isConversationStarted, setIsConversationStarted] = useState<boolean>(false);
    const { isMobile, isTablet } = useContextProvider();

    const getConnectionStatusMessage = (): string => {
        switch (connectionState) {
            case CONVERSATION_STATUS.CONNECTING:
                return '🟡 Connecting to Server...';
            case CONVERSATION_STATUS.CONNECTED:
                return '🟢 Connected to Server ✓';
            case CONVERSATION_STATUS.DISCONNECTED:
                return '🔴 Disconnected from Server';
            case CONVERSATION_STATUS.ERROR:
                return '🔴 Connection error from Server';
            default:
                return '🟡 Connecting to Server...';
        }
    };

    const getConnectionStatusColor = (): string => {
        switch (connectionState) {
            case CONVERSATION_STATUS.CONNECTED:
                return '#4CAF50';
            case CONVERSATION_STATUS.CONNECTING:
                return '#FF9800';
            case CONVERSATION_STATUS.DISCONNECTED:
            case CONVERSATION_STATUS.ERROR:
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
            if (serverStartTime) {
                const serverStartDate = new Date(serverStartTime);
                const now = new Date();
                const elapsed = now.getTime() - serverStartDate.getTime();
                setElapsedTime(elapsed);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [serverStartTime]);

    const handleUserSpeakingChange = useCallback((speaking: boolean) => {
        setIsUserSpeaking(speaking && !isMicMuted);
    }, [isMicMuted]);

    useVoiceStreaming(websocketRef, sessionId, handleUserSpeakingChange, isMicMuted, connectionState === CONVERSATION_STATUS.CONNECTED, isConversationStarted, isAiSpeaking);

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
        switch (response.type) {
            case WEBSOCKET_TYPES.CONNECTION_ESTABLISHED:
                setSessionId(response.session_id);
                setServerStartTime(response.started_at);
                
                setConnectionState(CONVERSATION_STATUS.CONNECTED);
                break;
            case WEBSOCKET_TYPES.USER_FULL_TRANSCRIPT:
                chatHistoryRef.current?.handleFinalTranscript(response, ACTOR.USER);
                break;
            case WEBSOCKET_TYPES.CONVERSATION_STARTED:
                setIsConversationStarted(true);
                break;
            case WEBSOCKET_TYPES.INTERVIWER_RESPONSE:
                chatHistoryRef.current?.handleFinalTranscript(response, ACTOR.INTERVIEWER);
                break;
            case CONVERSATION_STATUS.ERROR:
                console.error("Server error:", response.message || response);
                break;
            case CONVERSATION_STATUS.DISCONNECTED:
                console.warn("Server disconnect:", response.message || response);
                break;
            default:
                console.warn("Unknown message type:", response);
        }
    }, [sessionId, connectionState]);

    const initializeWebSocket = useCallback(() => {
        try {
            setConnectionState(CONVERSATION_STATUS.CONNECTING);
            
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const wsUrl = accessToken
                ? `${websocketUrl}?access_token=${accessToken}`
                : websocketUrl;

            websocketRef.current = new WebSocket(wsUrl);

            websocketRef.current.onopen = () => {
            };

            websocketRef.current.onclose = (_event) => {
                setConnectionState(CONVERSATION_STATUS.DISCONNECTED);
                setSessionId(null);
                
            };

            websocketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setConnectionState(CONVERSATION_STATUS.ERROR);
            };

            websocketRef.current.onmessage = async (event) => {
                try {
                    if (event.data instanceof Blob) {
                        const buffer = await event.data.arrayBuffer();
                        const view = new DataView(buffer);
                
                        const headerLength = view.getUint32(0, false);
                        const headerBytes = new Uint8Array(buffer.slice(4, 4 + headerLength));
                        const headerJson = new TextDecoder("utf-8").decode(headerBytes);
                        const header = JSON.parse(headerJson);
                
                        const audioData = buffer.slice(4 + headerLength);
                
                        if (header.type === WEBSOCKET_TYPES.INTERVIEWER_AUDIO_CHUNKING) {
                            const isConnected = connectionState === CONVERSATION_STATUS.CONNECTED || connectionState === CONVERSATION_STATUS.CONNECTING;
                        
                            await playBufferedAudio(audioData, setIsAiSpeaking, isHeadphonesMuted, isConnected);
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
                        {(connectionState === CONVERSATION_STATUS.CONNECTING) && (
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
                    {connectionState === CONVERSATION_STATUS.CONNECTED && !isConversationStarted && (
                        <div style={{
                            fontSize: isMobile ? '12px' : '14px',
                            color: '#FF9800',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div>
                                🟡 Waiting for conversation to start...
                            </div>
                        </div>
                    )}
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
                            isConnected={connectionState === CONVERSATION_STATUS.CONNECTED}
                            isConversationStarted={isConversationStarted}
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
