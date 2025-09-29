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
import { AudioQueueManager } from "../utils/AudioQueueManager";

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
    const [isUserTurn, setIsUserTurn] = useState<boolean>(false);
    const [connectionState, setConnectionState] = useState<WebSocketConnectionState>(CONVERSATION_STATUS.CONNECTING);
    const websocketRef = useRef<WebSocket | null>(null);
    const chatHistoryRef = useRef<ChatHistoryRef>(null);
    const dispatch = useDispatch();
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [serverStartTime, setServerStartTime] = useState<string | null>(null);
    const [isConversationStarted, setIsConversationStarted] = useState<boolean>(false);
    const [timeoutSeconds, setTimeoutSeconds] = useState<number>(120); // 2 minutes
    const [isTimeoutActive, setIsTimeoutActive] = useState<boolean>(false);
    const { isMobile, isTablet } = useContextProvider();
    const isInterviewerTurnEndedReceivedRef = useRef<boolean>(false);
    const audioQueueManagerRef = useRef<AudioQueueManager>(new AudioQueueManager());
    const timeoutIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const showTranscript = useCallback((response: any) => {
        chatHistoryRef.current?.handleFinalTranscript(response, ACTOR.INTERVIEWER);
    }, []);

    // Timeout management functions
    const startTimeout = useCallback(() => {
        if (timeoutIntervalRef.current) {
            clearInterval(timeoutIntervalRef.current);
        }
        
        setTimeoutSeconds(120); // Reset to 2 minutes
        setIsTimeoutActive(true);
        
        timeoutIntervalRef.current = setInterval(() => {
            setTimeoutSeconds(prev => {
                if (prev <= 1) {
                    setIsTimeoutActive(false);
                    clearInterval(timeoutIntervalRef.current!);
                    // Handle timeout - could close websocket or show warning
                    console.log('WebSocket timeout reached!');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const resetTimeout = useCallback(() => {
        if (timeoutIntervalRef.current) {
            clearInterval(timeoutIntervalRef.current);
        }
        setTimeoutSeconds(120);
        setIsTimeoutActive(false);
    }, []);

    const pauseTimeout = useCallback(() => {
        if (timeoutIntervalRef.current) {
            clearInterval(timeoutIntervalRef.current);
        }
        setIsTimeoutActive(false);
    }, []);

    useEffect(() => {
    }, [connectionState]);

    const getConnectionStatusText = (): string => {
        switch (connectionState) {
            case CONVERSATION_STATUS.CONNECTING:
                return 'Connecting to Session';
            case CONVERSATION_STATUS.CONNECTED:
                return 'In Session';
            case CONVERSATION_STATUS.DISCONNECTED:
                return 'Disconnected';
            case CONVERSATION_STATUS.ERROR:
                return 'Connection Error';
            default:
                return 'Ready to Connect';
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
                return '#9E9E9E';
        }
    };

    const getConnectionStatusTextColor = (): string => {
        switch (connectionState) {
            case CONVERSATION_STATUS.CONNECTED:
                return '#2E7D32';
            case CONVERSATION_STATUS.CONNECTING:
                return '#F57C00';
            case CONVERSATION_STATUS.DISCONNECTED:
            case CONVERSATION_STATUS.ERROR:
                return '#C62828';
            default:
                return '#616161';
        }
    };

    const getConnectionStatusAnimation = (): string => {
        switch (connectionState) {
            case CONVERSATION_STATUS.CONNECTED:
                return 'statusConnectedPulse 2s ease-in-out infinite';
            case CONVERSATION_STATUS.CONNECTING:
                return 'statusConnectingPulse 1s ease-in-out infinite';
            default:
                return 'none';
        }
    };

    // Timeout helper functions
    const formatTimeoutDisplay = (): string => {
        const minutes = Math.floor(timeoutSeconds / 60);
        const seconds = timeoutSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getTimeoutColor = (): string => {
        if (timeoutSeconds <= 30) return '#F44336'; // Red - Critical
        if (timeoutSeconds <= 60) return '#FF9800'; // Orange - Warning
        return '#4CAF50'; // Green - Safe
    };

    const getTimeoutBackground = (): string => {
        if (timeoutSeconds <= 30) return 'rgba(244, 67, 54, 0.1)';
        if (timeoutSeconds <= 60) return 'rgba(255, 152, 0, 0.1)';
        return 'rgba(76, 175, 80, 0.1)';
    };

    const getTimeoutBorderColor = (): string => {
        if (timeoutSeconds <= 30) return 'rgba(244, 67, 54, 0.3)';
        if (timeoutSeconds <= 60) return 'rgba(255, 152, 0, 0.3)';
        return 'rgba(76, 175, 80, 0.3)';
    };

    const getTimeoutAnimation = (): string => {
        if (timeoutSeconds <= 10) return 'timeoutCriticalPulse 0.5s ease-in-out infinite';
        if (timeoutSeconds <= 30) return 'timeoutWarningPulse 1s ease-in-out infinite';
        return 'none';
    };

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
        setIsUserTurn(false);
    }, []);


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

    useVoiceStreaming(websocketRef, sessionId, handleUserSpeakingChange, isMicMuted, connectionState === CONVERSATION_STATUS.CONNECTED, isConversationStarted, handleUserSegmentEnd, isUserTurn);

    const handleMicMuteChange = useCallback((isMuted: boolean) => {
        setIsMicMuted(isMuted);
        
        if (isMuted) {
            setIsUserSpeaking(false);
        }
    }, []);

    const handleHeadphoneMuteChange = useCallback((isMuted: boolean) => {
        setIsHeadphonesMuted(isMuted);
    }, []);

    const handleWebSocketMessage = useCallback(async (response: any) => {
        switch (response.type) {
            case WEBSOCKET_TYPES.CONNECTION_ESTABLISHED:
                setSessionId(response.session_id);
                setServerStartTime(response.started_at);
                
                setConnectionState(CONVERSATION_STATUS.CONNECTED);
                break;
            case WEBSOCKET_TYPES.USER_FULL_TRANSCRIPT:
                chatHistoryRef.current?.handleFinalTranscript(response, ACTOR.USER);
                resetTimeout(); // Reset timeout when user speaks
                break;
            case WEBSOCKET_TYPES.CONVERSATION_STARTED:
                setIsConversationStarted(true);
                setIsUserTurn(true);
                break;
            case WEBSOCKET_TYPES.CONVERSATION_STARTING:
                setIsConversationStarted(true);
                break;
            case WEBSOCKET_TYPES.INTERVIEWER_TURN_START:
                isInterviewerTurnEndedReceivedRef.current = false;
                setIsUserTurn(false);
                pauseTimeout(); // Pause timeout when AI is speaking
                break;
            case WEBSOCKET_TYPES.INTERVIEWER_TURN_END:
                isInterviewerTurnEndedReceivedRef.current = true;
                startTimeout(); // Start timeout when it's user's turn
                break;
            case WEBSOCKET_TYPES.INTERVIWER_RESPONSE:
                audioQueueManagerRef.current.addMetadataToCurrentTurn(response);
                audioQueueManagerRef.current.tryProcessAudioQueue(
                    {
                        setIsAiSpeaking,
                        showTranscript,
                        setIsUserTurn,
                        getIsInterviewerTurnEndedReceived: () => isInterviewerTurnEndedReceivedRef.current
                    },
                    isHeadphonesMuted,
                    connectionState === CONVERSATION_STATUS.CONNECTED || connectionState === CONVERSATION_STATUS.CONNECTING
                );
                break;
            case WEBSOCKET_TYPES.SUMMARIZE_INTERVIEW_SESSION:
                dispatch(setEndInterviewSessionFinishedAction());
                websocketRef.current?.close();
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
    }, [sessionId, connectionState, websocketRef]);

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
                
                audioQueueManagerRef.current.clearQueue();
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
                            await audioQueueManagerRef.current.collectAudioChunk(audioData);
                            
                            audioQueueManagerRef.current.tryProcessAudioQueue(
                                {
                                    setIsAiSpeaking,
                                    showTranscript,
                                    setIsUserTurn,
                                    getIsInterviewerTurnEndedReceived: () => isInterviewerTurnEndedReceivedRef.current
                                },
                                isHeadphonesMuted,
                                connectionState === CONVERSATION_STATUS.CONNECTED
                            );
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
            
            audioQueueManagerRef.current.clearQueue();
            
            // Cleanup timeout interval
            if (timeoutIntervalRef.current) {
                clearInterval(timeoutIntervalRef.current);
            }
        };
    }, []);

    return (
        <ContentLayout>
            <style>
                {`
                @keyframes timeoutWarningPulse {
                    0%, 100% { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                    50% { 
                        opacity: 0.6; 
                        transform: scale(1.1); 
                    }
                }
                
                @keyframes timeoutCriticalPulse {
                    0%, 100% { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                    50% { 
                        opacity: 0.3; 
                        transform: scale(1.3); 
                    }
                }
                
                @keyframes pieChartPulse {
                    0%, 100% { 
                        opacity: 1; 
                        filter: drop-shadow(0 0 4px currentColor); 
                    }
                    50% { 
                        opacity: 0.7; 
                        filter: drop-shadow(0 0 8px currentColor); 
                    }
                }
                `}
            </style>
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

                    {isConversationStarted && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 12px',
                            borderRadius: '20px',
                            background: getTimeoutBackground(),
                            border: `1px solid ${getTimeoutBorderColor()}`,
                            boxShadow: `0 4px 16px ${getTimeoutColor()}15`,
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {/* Pie Chart SVG */}
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg
                                    width={isMobile ? "32" : "36"}
                                    height={isMobile ? "32" : "36"}
                                    style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 4px ${getTimeoutColor()}40)` }}
                                >
                                    {/* Background circle */}
                                    <circle
                                        cx={isMobile ? "16" : "18"}
                                        cy={isMobile ? "16" : "18"}
                                        r={isMobile ? "14" : "16"}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="2"
                                    />
                                    
                                    {/* Progress circle */}
                                    <circle
                                        cx={isMobile ? "16" : "18"}
                                        cy={isMobile ? "16" : "18"}
                                        r={isMobile ? "14" : "16"}
                                        fill="none"
                                        stroke={getTimeoutColor()}
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * (isMobile ? 14 : 16)}`}
                                        strokeDashoffset={`${2 * Math.PI * (isMobile ? 14 : 16) * (1 - (isTimeoutActive ? timeoutSeconds / 120 : 1))}`}
                                        style={{
                                            transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease',
                                            animation: timeoutSeconds <= 10 ? 'pieChartPulse 0.5s ease-in-out infinite' : 'none'
                                        }}
                                    />
                                </svg>
                                
                                {/* Center text */}
                                <div style={{
                                    position: 'absolute',
                                    fontSize: isMobile ? '8px' : '9px',
                                    color: getTimeoutColor(),
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    lineHeight: '1',
                                    pointerEvents: 'none'
                                }}>
                                    {isTimeoutActive ? formatTimeoutDisplay() : '2:00'}
                                </div>
                            </div>
                            
                            <div style={{
                                fontSize: isMobile ? '11px' : '12px',
                                color: getTimeoutColor(),
                                fontWeight: '600',
                                letterSpacing: '0.3px',
                                opacity: isTimeoutActive ? 1 : 0.6
                            }}>
                                {isTimeoutActive ? 'Response timeout' : 'Ready'}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 20px 5px 20px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getConnectionStatusColor(),
                            boxShadow: `0 0 12px ${getConnectionStatusColor()}60`,
                            animation: getConnectionStatusAnimation(),
                            transition: 'all 0.3s ease'
                        }} />
                        
                        <div style={{
                            fontSize: isMobile ? '12px' : '14px',
                            color: getConnectionStatusTextColor(),
                            fontWeight: '600',
                            letterSpacing: '0.5px'
                        }}>
                            {getConnectionStatusText()}
                        </div>
                        
                        {(connectionState === CONVERSATION_STATUS.CONNECTING) && (
                            <div style={{
                                width: '14px',
                                height: '14px',
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
