import { useSearchParams } from "react-router-dom";
import ChatHistory, { type ChatHistoryRef } from "../components/common/ChatHistory";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACTOR, CONVERSATION_STATUS, ROUTES, STORAGE_KEYS, WEBSOCKET_TYPES } from "../constants";
import InterviewRecording from "../components/common/InterviewRecording";
import { useVoiceStreaming } from "../hook/useVoiceStreaming";
import { Colors } from "../assets/styles";
import ContentLayout from "../components/layout/ContentLayout";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useDispatch } from "react-redux";
import { useContextProvider } from "../components/layout/ContextProvider";
import { setEndInterviewSessionLoadingAction, setEndInterviewSessionFinishedAction } from "../actions/interviewAction";
import { AudioQueueManager } from "../utils/AudioQueueManager";
import { safeNavigate } from "../utils/navigation";

type WebSocketConnectionState =typeof CONVERSATION_STATUS.CONNECTING | typeof CONVERSATION_STATUS.CONNECTED | typeof CONVERSATION_STATUS.DISCONNECTED | typeof CONVERSATION_STATUS.ERROR;

const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    const [websocketUrl] = useState(`ws://localhost:8080/api/v1/ws/connect/${sessionTokenParam}`);
    const sessionIdRef = useRef<string | null>(null);
    const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [connectionState, setConnectionState] = useState<WebSocketConnectionState>(CONVERSATION_STATUS.CONNECTING);
    const websocketRef = useRef<WebSocket | null>(null);
    const chatHistoryRef = useRef<ChatHistoryRef>(null);
    const dispatch = useDispatch();
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [serverStartTime, setServerStartTime] = useState<string | null>(null);
    const [isConversationStarted, setIsConversationStarted] = useState<boolean>(false);
    const [showInactivityPopup, setShowInactivityPopup] = useState<boolean>(false);
    const [showSessionTimeoutPopup, setShowSessionTimeoutPopup] = useState<boolean>(false);
    const [inactivityMessage, setInactivityMessage] = useState<string>("");
    const [timeoutMessage, setTimeoutMessage] = useState<string>("");
    const { isMobile, isTablet } = useContextProvider();
    const isInterviewerTurnEndedReceivedRef = useRef<boolean>(false);
    const audioQueueManagerRef = useRef<AudioQueueManager>(new AudioQueueManager());
    const isHeadphonesMutedRef = useRef<boolean>(false);
    const isUserTurnRef = useRef<boolean>(false);
    const isSessionCompletedRef = useRef<boolean>(false);
    const isInitializingRef = useRef<boolean>(false);

    const showTranscript = useCallback((response: any) => {
        chatHistoryRef.current?.handleFinalTranscript(response, ACTOR.INTERVIEWER);
    }, []);

    const getConnectionStatusText = (): string => {
        switch (connectionState) {
            case CONVERSATION_STATUS.CONNECTING:
                return 'Connecting...';
            case CONVERSATION_STATUS.CONNECTED:
                return 'Interview in progress';
            case CONVERSATION_STATUS.DISCONNECTED:
                return 'Session ended';
            case CONVERSATION_STATUS.ERROR:
                return 'Something went wrong';
            default:
                return 'Ready to start';
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
        isUserTurnRef.current = false;
    }, []);

    const handleEndInterviewSession = useCallback(() => {
        if (!sessionIdRef.current || !websocketRef.current) {
            return;
        }

        dispatch(setEndInterviewSessionLoadingAction());
        const endSessionMessage = {
            type: WEBSOCKET_TYPES.END_INTERVIEW_SESSION,
            session_id: sessionIdRef.current
        };

        try {
            websocketRef.current.send(JSON.stringify(endSessionMessage));
        } catch (error) {
            console.error('Failed to send end interview session message:', error);
        }
    }, [dispatch]);

    const handleCompleteSession = useCallback(() => {
        if (!sessionIdRef.current || !websocketRef.current) {
            return;
        }

        dispatch(setEndInterviewSessionLoadingAction());
        const completeSessionMessage = {
            type: WEBSOCKET_TYPES.USER_COMPLETE_SESSION,
            session_id: sessionIdRef.current
        };

        try {
            websocketRef.current.send(JSON.stringify(completeSessionMessage));
        } catch (error) {
            console.error('Failed to send complete session message:', error);
        }
    }, [dispatch]);

    const handleContinueSession = useCallback(() => {
        setShowInactivityPopup(false);
    }, []);

    const handleEndSessionFromPopup = useCallback(() => {
        setShowInactivityPopup(false);
        handleEndInterviewSession();
    }, [handleEndInterviewSession]);

    const handleGoToRecordings = useCallback(() => {
        setShowSessionTimeoutPopup(false);
        safeNavigate(ROUTES.RECORDINGS);
    }, []);

    useVoiceStreaming(websocketRef, sessionIdRef.current, handleUserSpeakingChange, isMicMuted, connectionState === CONVERSATION_STATUS.CONNECTED, isConversationStarted, handleUserSegmentEnd, isUserTurnRef.current);

    const handleMicMuteChange = useCallback((isMuted: boolean) => {
        setIsMicMuted(isMuted);
        
        if (isMuted) {
            setIsUserSpeaking(false);
        }
    }, []);

    const handleHeadphoneMuteChange = useCallback((isMuted: boolean) => {
        isHeadphonesMutedRef.current = isMuted;

        if (isMuted) {
            setIsMicMuted(true);
            audioQueueManagerRef.current.setVolume(0);
        } else {
            audioQueueManagerRef.current.setVolume(1);
        }
    }, []);

    const handleWebSocketMessage = useCallback(async (response: any) => {
        switch (response.type) {
            case WEBSOCKET_TYPES.CONNECTION_ESTABLISHED:
                sessionIdRef.current = response.session_id;
                setServerStartTime(response.started_at);
                
                setConnectionState(CONVERSATION_STATUS.CONNECTED);
                break;
            case WEBSOCKET_TYPES.USER_FULL_TRANSCRIPT:
                chatHistoryRef.current?.handleFinalTranscript(response, ACTOR.USER);
                break;
            case WEBSOCKET_TYPES.CONVERSATION_STARTED:
                setIsConversationStarted(true);
                isUserTurnRef.current = true;
                break;
            case WEBSOCKET_TYPES.CONVERSATION_STARTING:
                setIsConversationStarted(true);
                break;
            case WEBSOCKET_TYPES.INTERVIEWER_TURN_START:
                isInterviewerTurnEndedReceivedRef.current = false;
                isUserTurnRef.current = false;
                break;
            case WEBSOCKET_TYPES.INTERVIEWER_TURN_END:
                isInterviewerTurnEndedReceivedRef.current = true;
                break;
            case WEBSOCKET_TYPES.INTERVIWER_RESPONSE:
                audioQueueManagerRef.current.addMetadataToCurrentTurn(response);
                audioQueueManagerRef.current.tryProcessAudioQueue(
                    {
                        setIsAiSpeaking,
                        showTranscript,
                        setIsUserTurn: (isUserTurn: boolean) => isUserTurnRef.current = isUserTurn,
                        getIsInterviewerTurnEndedReceived: () => isInterviewerTurnEndedReceivedRef.current,
                        getIsSessionCompleted: () => isSessionCompletedRef.current,
                        sendCompleteSession: handleCompleteSession
                    },
                    isHeadphonesMutedRef.current,
                    connectionState === CONVERSATION_STATUS.CONNECTED || connectionState === CONVERSATION_STATUS.CONNECTING
                );
                break;
            case WEBSOCKET_TYPES.SUMMARIZE_INTERVIEW_SESSION:
                dispatch(setEndInterviewSessionFinishedAction());
                websocketRef.current?.close();
                break;
            case WEBSOCKET_TYPES.INTERVIEW_COMPLETED:
                isSessionCompletedRef.current = true;
                isInterviewerTurnEndedReceivedRef.current = true;
                break;
            case CONVERSATION_STATUS.ERROR:
                console.error("Server error:", response.message || response);
                break;
            case CONVERSATION_STATUS.DISCONNECTED:
                console.warn("Server disconnect:", response.message || response);
                break;
                
            case WEBSOCKET_TYPES.INTERVIEW_SESSION_TIMED_OUT:
                setTimeoutMessage(response.message || "Your interview session has timed out and has been automatically ended.");
                setShowSessionTimeoutPopup(true);
                break;
            case WEBSOCKET_TYPES.INACTIVITY_WARNING:
                setInactivityMessage(response.message || "You've been inactive for a while. Do you want to continue this interview session or end it?");
                setShowInactivityPopup(true);
                break;
            case WEBSOCKET_TYPES.INTERVIEW_SESSION_ALREADY_TIMED_OUT || WEBSOCKET_TYPES.INTERVIEW_SESSION_ALREADY_COMPLETED:
                safeNavigate(ROUTES.RECORDINGS);
                break;
            default:
                console.warn("Unknown message type:", response);
        }
    }, [connectionState, websocketRef]);

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
                sessionIdRef.current = null;
                
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
                                    setIsUserTurn: (isUserTurn: boolean) => isUserTurnRef.current = isUserTurn,
                                    getIsInterviewerTurnEndedReceived: () => isInterviewerTurnEndedReceivedRef.current,
                                    getIsSessionCompleted: () => isSessionCompletedRef.current,
                                    sendCompleteSession: handleCompleteSession
                                },
                                isHeadphonesMutedRef.current,
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
        // Prevent double initialization - check if already connecting or open
        if (websocketRef.current?.readyState === WebSocket.OPEN || 
            websocketRef.current?.readyState === WebSocket.CONNECTING) {
            // Connection exists, mark as initialized to prevent cleanup
            isInitializingRef.current = true;
            return;
        }

        // Only initialize if not already in progress
        if (isInitializingRef.current) {
            return;
        }

        isInitializingRef.current = true;
        initializeWebSocket();

        return () => {
            // Mark as not initializing anymore
            isInitializingRef.current = false;
            
            // Delay cleanup to give Strict Mode a chance to remount
            setTimeout(() => {
                // Only close if not reinitialized (true unmount, not Strict Mode)
                if (!isInitializingRef.current && websocketRef.current) {
                    websocketRef.current.close();
                    websocketRef.current = null;
                    audioQueueManagerRef.current.clearQueue();
                }
            }, 50);
        };
    }, []);

    return (
        <ContentLayout>
            <style>
                {`
                
                @keyframes statusConnectedPulse {
                    0%, 100% { 
                        opacity: 1; 
                        transform: scale(1);
                        box-shadow: 0 0 12px currentColor60;
                    }
                    50% { 
                        opacity: 0.7; 
                        transform: scale(1.2);
                        box-shadow: 0 0 20px currentColor80;
                    }
                }
                
                @keyframes statusConnectingPulse {
                    0%, 100% { 
                        opacity: 1; 
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.5; 
                        transform: scale(1.3);
                    }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                `}
            </style>
            <div style={{ width: '100%', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '20px 20px 0 20px' }}>
                    <div>
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
                    
                </div>

                <div style={{borderBottom: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`}}></div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: isMobile ? '80%' : isTablet ? '70%' : '60%'}}>
                        <InterviewRecording
                            websocketUrl={websocketUrl}
                            sessionToken={sessionTokenParam || ''}
                            isAiSpeaking={isAiSpeaking}
                            isUserSpeaking={isUserSpeaking}
                            isUserTurn={isUserTurnRef.current}
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
                        <ChatHistory ref={chatHistoryRef} session_token={sessionTokenParam || ''} isUserTurn={isUserTurnRef.current} />
                    </div>
                </div>
                    
            </div>

            <ConfirmationModal
                isOpen={showInactivityPopup}
                title="Session Inactivity Warning"
                message={inactivityMessage}
                confirmText="Continue Session"
                cancelText="End Session"
                confirmButtonColor={Colors.SUCCESS_COLOR}
                cancelButtonColor={Colors.TEXT_WHITE_COLOR}
                cancelButtonBackground={Colors.TEXT_ERROR_COLOR}
                onConfirm={handleContinueSession}
                onCancel={handleEndSessionFromPopup}
            />

            <ConfirmationModal
                isOpen={showSessionTimeoutPopup}
                title="Session Timed Out"
                message={timeoutMessage}
                confirmText="Go to Recordings"
                confirmButtonColor={Colors.TEXT_ERROR_COLOR}
                onConfirm={handleGoToRecordings}
                onCancel={handleGoToRecordings}
            />
        </ContentLayout>
    );
};

export default InterviewSimulation;
