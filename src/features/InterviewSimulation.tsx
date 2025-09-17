import { useSearchParams } from "react-router-dom";
import ChatHistory, { type ChatHistoryRef } from "../components/common/ChatHistory";
import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS, WEBSOCKET_TYPES } from "../constants";
import InterviewRecording from "../components/common/InterviewRecording";
import { useVoiceStreaming } from "../hook/useVoiceStreaming";
import { generateSegmentId } from "../utils/generator";
import { Colors } from "../assets/styles";
import ContentLayout from "../components/layout/ContentLayout";
import { useDispatch, useSelector } from "react-redux";
import { getInterviewSessionInformation } from "../actions/interviewAction";
import type { RootState } from "../reducers/rootReducer";
import { DoorOpen } from "lucide-react";

const audioQueue: ArrayBuffer[] = [];
let audioPlaying = false;
const audioCtx = new AudioContext();

async function playBinaryAudio(buffer: ArrayBuffer, setIsAiSpeaking: (speaking: boolean) => void) {
    audioQueue.push(buffer);

    if (!audioPlaying) {
        audioPlaying = true;
        setIsAiSpeaking(true); // AI starts speaking

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
                source.connect(audioCtx.destination);
                source.start();

                await new Promise<void>((resolve) => {
                    source.onended = () => resolve();
                });
            } catch (e) {
                console.error("Audio playback failed:", e);
            }
        }

        audioPlaying = false;
        setIsAiSpeaking(false); // AI stops speaking
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

const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    const [websocketUrl] = useState(`ws://localhost:8080/api/v1/ws/connect/${sessionTokenParam}`);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
    const websocketRef = useRef<WebSocket | null>(null);
    const chatHistoryRef = useRef<ChatHistoryRef>(null);
    const dispatch = useDispatch();
    // const [elapsedTime, setElapsedTime] = useState<number>(0);

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const interviewSessionInformation = useSelector((state: RootState) => state.interview.interviewSessionInformation);

    useEffect(() => {
        if (sessionTokenParam) {
            dispatch(getInterviewSessionInformation(sessionTokenParam));
        }
    }, [sessionTokenParam, dispatch]);

    const handleUserSpeakingChange = useCallback((speaking: boolean) => {
        setIsUserSpeaking(speaking);
    }, []);

    useVoiceStreaming(websocketRef, sessionId, handleUserSpeakingChange);

    const handleWebSocketMessage = useCallback((response: any) => {
        switch (response.type) {
            case WEBSOCKET_TYPES.CONNECTION_ESTABLISHED:
                console.log("🔗 WebSocket connected, sessionId established:", response.session_id);
                setSessionId(response.session_id);
                break;
            case WEBSOCKET_TYPES.USER_PARTIAL_TRANSCRIPT:
                chatHistoryRef.current?.handlePartialTranscript(response.segment_id, response.transcript, "user");
                break;
            case WEBSOCKET_TYPES.INTERVIWER_RESPONSE:
                if (sessionId) {
                    const segment_id = generateSegmentId(sessionId);
                    chatHistoryRef.current?.handlePartialTranscript(segment_id, response.message, "interviewer");
                } else {
                    console.warn("⚠️ Received interviewer response but no sessionId available");
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
    }, [sessionId]);

    const initializeWebSocket = useCallback(() => {
        try {
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const wsUrl = accessToken
                ? `${websocketUrl}?access_token=${accessToken}`
                : websocketUrl;

            websocketRef.current = new WebSocket(wsUrl);

            websocketRef.current.onclose = (event) => {
                console.log("WebSocket closed:", event.code, event.reason);
            };

            websocketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
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
                            await playBinaryAudio(audioData, setIsAiSpeaking);
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

    useEffect(() => {
        initializeWebSocket();

        return () => {
            websocketRef.current?.close();
            websocketRef.current = null;
        };
    }, [initializeWebSocket]);

    return (
        <ContentLayout>
            <div style={{ width: '100%', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '20px 20px 0 20px' }}>
                    <div style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: Colors.PRIMARY_COLOR,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px'
                    }}>
                        <div>
                            Session Position: {interviewSessionInformation.position}
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center',
                        gap: '10px', 
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        const span = e.currentTarget.querySelector('span');
                        if (span) {
                            span.style.borderBottom = `2px solid ${Colors.ACCENT_COLOR}`;
                        }
                    }}
                    onMouseLeave={(e) => {
                        const span = e.currentTarget.querySelector('span');
                        if (span) {
                            span.style.borderBottom = '2px solid transparent';
                        }
                        }}
                    >
                        <div style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: Colors.PRIMARY_COLOR,
                        }}>
                            {/* Time: {formatTime(elapsedTime)} */}
                            9
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 20px 5px 20px' }}>
                    <div style={{
                        fontSize: '15px',
                        color: Colors.PRIMARY_COLOR,
                    }}>
                        <div>
                            Connecting
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center',
                        gap: '10px', 
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        const span = e.currentTarget.querySelector('span');
                        if (span) {
                            span.style.borderBottom = `2px solid ${Colors.ACCENT_COLOR}`;
                        }
                    }}
                    onMouseLeave={(e) => {
                        const span = e.currentTarget.querySelector('span');
                        if (span) {
                            span.style.borderBottom = '2px solid transparent';
                        }
                        }}
                    >
                        <DoorOpen style={{ width: '25px', height: '25px', color: Colors.ACCENT_COLOR }} />
                        <span style={{
                            fontSize: '17px',
                            fontWeight: '600',
                            color: Colors.ACCENT_COLOR,
                            transition: 'all 0.2s ease',
                            borderBottom: '2px solid transparent'
                        }}>End Interview</span>
                    </div>
                </div>

                <div style={{borderBottom: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`}}></div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '50%'}}>
                        <InterviewRecording
                            websocketUrl={websocketUrl}
                            sessionToken={sessionTokenParam || ''}
                            isAiSpeaking={isAiSpeaking}
                            isUserSpeaking={isUserSpeaking}
                        />
                    </div>
                    <div style={{ width: '50%', height: '100%', overflow: 'hidden' }}>
                        <ChatHistory ref={chatHistoryRef} session_token={sessionTokenParam || ''} />
                    </div>
                </div>
                    
            </div>
        </ContentLayout>
    );
};

export default InterviewSimulation;
