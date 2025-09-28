import { useSearchParams } from "react-router-dom";
import ChatHistory, { type ChatHistoryRef } from "../components/common/ChatHistory";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACTOR, CONVERSATION_STATUS, STORAGE_KEYS, WEBSOCKET_TYPES } from "../constants";
import InterviewRecording from "../components/common/InterviewRecording";
import { useVoiceStreaming } from "../hook/useVoiceStreaming";
import { Colors } from "../assets/styles";
import ContentLayout from "../components/layout/ContentLayout";
import { useDispatch } from "react-redux";
import { useContextProvider } from "../components/layout/ContextProvider";
import { setEndInterviewSessionLoadingAction, setEndInterviewSessionFinishedAction } from "../actions/interviewAction";

const audioQueue: Blob[] = [];
let isPlaying = false;

async function playMp3AudioChunk(
    chunk: ArrayBuffer,
    setIsAiSpeaking: (speaking: boolean) => void,
    isHeadphonesMuted: boolean,
    isConnected: boolean,
    onAiFinishedSpeaking: () => void,
    isInterviewerTurn: boolean,
    handleInterviewerTurn: (turn: boolean) => void
) {
    if (!isConnected) return;

    audioQueue.push(new Blob([chunk], { type: 'audio/mpeg' }));

    if (isPlaying) return;

    isPlaying = true;
    setIsAiSpeaking(true);

    while (audioQueue.length > 0) {
        const currentBlob = audioQueue.shift()!;
        const audioUrl = URL.createObjectURL(currentBlob);
        const audio = new Audio(audioUrl);

        if (isHeadphonesMuted) {
            audio.volume = 0;
        }

        await new Promise<void>((resolve) => {
            audio.onended = () => resolve();
            audio.onerror = () => {
                console.error("🔴 MP3 playback failed.");
                resolve();
            };
            audio.play().catch((err) => {
                console.error("🔴 Error playing MP3:", err);
                resolve();
            });
        });

        URL.revokeObjectURL(audioUrl);
    }

    isPlaying = false;
    setIsAiSpeaking(false);
    onAiFinishedSpeaking?.();

    if (isInterviewerTurn) {
        handleInterviewerTurn(false);
    }
}

type WebSocketConnectionState =typeof CONVERSATION_STATUS.CONNECTING | typeof CONVERSATION_STATUS.CONNECTED | typeof CONVERSATION_STATUS.DISCONNECTED | typeof CONVERSATION_STATUS.ERROR;

const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    const [websocketUrl] = useState(`ws://localhost:8080/api/v1/ws/connect/${sessionTokenParam}`);
    const [isInterviewerTurn, setIsInterviewerTurn] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isHeadphonesMuted, setIsHeadphonesMuted] = useState<boolean>(false);
    const [isVoiceInputEnabled, setIsVoiceInputEnabled] = useState<boolean>(true);
    const [isUserTurn, setIsUserTurn] = useState<boolean>(false);
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
                return '🟡 Connect to Session';
            case CONVERSATION_STATUS.CONNECTED:
                return '🟢 In Session';
            case CONVERSATION_STATUS.DISCONNECTED:
                return '🔴 Disconnected from Session';
            case CONVERSATION_STATUS.ERROR:
                return '🔴 Connection error from Session';
            default:
                return '🟡 Connect to Session';
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

    const handleAiFinishedSpeaking = useCallback(() => {
        if (!isInterviewerTurn) {
            setIsVoiceInputEnabled(true);
            setIsUserTurn(true);
        }
    }, [isInterviewerTurn]);

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

    const handleUserSegmentEnd = useCallback(() => {
        setIsVoiceInputEnabled(false);
        setIsUserTurn(false);
    }, []);

    const handleInterviewerTurn = useCallback((turn: boolean) => {
        setIsUserTurn(!turn);
    }, []);

    useEffect(() => {
        console.log("log status", {
            isUserTurn,
            isAiSpeaking,
            isUserSpeaking,
            isMicMuted,
            isInterviewerTurn,
            isVoiceInputEnabled,
            isConversationStarted
        });
    }, [isUserTurn, isAiSpeaking, isUserSpeaking, isMicMuted, isInterviewerTurn, isVoiceInputEnabled, isConversationStarted]);

    const handleEndInterviewSession = useCallback(() => {
        if (!sessionId || !websocketRef.current) {
            return;
        }

        dispatch(setEndInterviewSessionLoadingAction());
        const endSessionMessage = {
            type: WEBSOCKET_TYPES.END_INTERVIEW_SESSION,
            session_id: sessionId
        };
        

        try {
            websocketRef.current.send(JSON.stringify(endSessionMessage));
        } catch (error) {
            console.error('Failed to send end interview session message:', error);
        }
    }, [sessionId]);

    useVoiceStreaming(websocketRef, sessionId, handleUserSpeakingChange, isMicMuted, connectionState === CONVERSATION_STATUS.CONNECTED, isConversationStarted, isAiSpeaking, isVoiceInputEnabled, handleUserSegmentEnd, isUserTurn);

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
                console.log("connection established");
                setSessionId(response.session_id);
                setServerStartTime(response.started_at);
                
                setConnectionState(CONVERSATION_STATUS.CONNECTED);
                break;
            case WEBSOCKET_TYPES.USER_FULL_TRANSCRIPT:
                console.log("user full transcript");
                chatHistoryRef.current?.handleFinalTranscript(response, ACTOR.USER);
                break;
            case WEBSOCKET_TYPES.CONVERSATION_STARTED:
                console.log("conversation started");
                setIsConversationStarted(true);
                setIsUserTurn(true);
                break;
            case WEBSOCKET_TYPES.INTERVIEWER_TURN_START:
                console.log("interviewer turn start");
                setIsInterviewerTurn(true);
                break;
            case WEBSOCKET_TYPES.INTERVIEWER_TURN_END:
                console.log("interviewer turn end");
                setIsInterviewerTurn(false);
                setIsAiSpeaking(false);
                break;
            case WEBSOCKET_TYPES.INTERVIWER_RESPONSE:
                console.log("interviewer response");
                chatHistoryRef.current?.handleFinalTranscript(response, ACTOR.INTERVIEWER);
                break;
            case WEBSOCKET_TYPES.SUMMARIZE_INTERVIEW_SESSION:
                console.log("summarize interview session");
                dispatch(setEndInterviewSessionFinishedAction());
                websocketRef.current?.close();
                break;
            case CONVERSATION_STATUS.ERROR:
                console.log("server error");
                console.error("Server error:", response.message || response);
                break;
            case CONVERSATION_STATUS.DISCONNECTED:
                console.log("server disconnect");
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
                            console.log("playQueuedAudio", audioData);
                            await playMp3AudioChunk(audioData, setIsAiSpeaking, isHeadphonesMuted, isConnected, handleAiFinishedSpeaking, isInterviewerTurn, handleInterviewerTurn);
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
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '20px 20px 0 20px' }}>
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
                            isUserTurn={isUserTurn}
                            onMicMuteChange={handleMicMuteChange}
                            onHeadphoneMuteChange={handleHeadphoneMuteChange}
                            onReconnect={handleManualReconnect}
                            websocketRef={websocketRef}
                            elapsedTime={elapsedTime}
                            isConnected={connectionState === CONVERSATION_STATUS.CONNECTED}
                            isConversationStarted={isConversationStarted}
                            onEndInterview={handleEndInterviewSession}
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
