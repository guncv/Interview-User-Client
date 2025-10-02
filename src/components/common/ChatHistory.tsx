import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatHistoryBySessionToken } from "../../actions/interviewAction";
import type { RootState } from "../../reducers/rootReducer";
import Colors from "../../assets/styles/Color";
import { useContextProvider } from "../layout/ContextProvider";
import { ACTOR } from "../../constants";
import InsiderLoadingSpinner from "./InsiderLoadingSpinner";

interface ChatHistoryProps {
    session_token: string;
    isUserTurn?: boolean;
}

interface ChatMessage {
    actor: string;
    transcript_text: string;
    start_at?: string;
    end_at?: string;
    id?: string;
    isStreaming?: boolean;
    isTyping?: boolean;
}

export interface ChatHistoryRef {
    handleFinalTranscript: (response: any, actor: typeof ACTOR.USER | typeof ACTOR.INTERVIEWER) => void;
}

const ChatHistory = forwardRef<ChatHistoryRef, ChatHistoryProps>(({ session_token, isUserTurn }, ref) => {
    const dispatch = useDispatch();
    const { chatHistory, chatHistoryLoading, loadMoreChatHistoryBySessionTokenLoading } = useSelector((state: RootState) => state.interview);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chatOrder, setChatOrder] = useState<ChatMessage[]>([]);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
    const { isMobile, isTablet } = useContextProvider();

    useEffect(() => {
        if (chatContainerRef.current) {
            if (loadMoreChatHistoryBySessionTokenLoading) {
                setPreviousScrollHeight(chatContainerRef.current.scrollHeight);
            } else {
                if (previousScrollHeight > 0) {
                    const newScrollHeight = chatContainerRef.current.scrollHeight;
                    const heightDifference = newScrollHeight - previousScrollHeight;
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollTop + heightDifference;
                    setPreviousScrollHeight(0);
                } else {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }
            }
        }
    }, [chatHistory, chatOrder, loadMoreChatHistoryBySessionTokenLoading, previousScrollHeight]);

    useEffect(() => {
        dispatch(getChatHistoryBySessionToken(session_token, null));
        setHasMoreMessages(true);
    }, [session_token]);

    useEffect(() => {
        const combined = [...chatHistory.chat_history, ...chatOrder];
        const lastMsg = combined[combined.length - 1];
        
        if (!lastMsg || lastMsg.actor === ACTOR.USER) {
            const typingId = "typing_bubble";
            setChatOrder(prev => {
                if (prev.some(m => m.id === typingId)) return prev;
        
                return [
                ...prev,
                {
                    actor: ACTOR.INTERVIEWER,
                    transcript_text: "",
                    id: typingId,
                    isTyping: true,
                },
                ];
            });
        } 
    }, [chatHistory, chatOrder]);

    const loadMoreMessages = useCallback(() => {
        if (loadMoreChatHistoryBySessionTokenLoading || !hasMoreMessages || chatHistory.cursor_turn_next === 0) {
            return;
        }

        dispatch(getChatHistoryBySessionToken(session_token, chatHistory.cursor_turn_next));
    }, [dispatch, session_token, loadMoreChatHistoryBySessionTokenLoading, hasMoreMessages, chatHistory.cursor_turn_next]);

    const handleScroll = useCallback(() => {
        if (!chatContainerRef.current) return;

        const { scrollTop } = chatContainerRef.current;
        
        const shouldLoadMore = scrollTop < 50 && !loadMoreChatHistoryBySessionTokenLoading && hasMoreMessages;
        
        if (shouldLoadMore) {
            loadMoreMessages();
        }
    }, [loadMoreMessages, loadMoreChatHistoryBySessionTokenLoading, hasMoreMessages]);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (loadMoreChatHistoryBySessionTokenLoading === false) {
            if (chatHistory.cursor_turn_next === 0) {
                setHasMoreMessages(false);
            }
        }
    }, [chatHistory.cursor_turn_next, loadMoreChatHistoryBySessionTokenLoading]);

    function handleFinalTranscript(response: any, actor: typeof ACTOR.USER | typeof ACTOR.INTERVIEWER) {
        const messageId = `${actor}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
        setChatOrder(prev => prev.filter(m => !m.isTyping));
    
        const newMessage: ChatMessage = {
            actor,
            transcript_text: "",
            start_at: "",
            end_at: "",
            id: messageId,
            isStreaming: true,
        };
        setChatOrder(prev => [...prev, newMessage]);
    
        const words = response.message.split(" ");
        let i = 0;
    
        const interval = setInterval(() => {
            i++;
            setChatOrder(prev => {
                const updated = [...prev];
                const idx = updated.findIndex(m => m.id === messageId);
                if (idx !== -1) {
                    updated[idx] = {
                        ...updated[idx],
                        transcript_text: words.slice(0, i).join(" "),
                        isStreaming: i < words.length,
                    };
                }
                return updated;
            });
    
            if (i >= words.length) {
                clearInterval(interval);
                setChatOrder(prev => {
                    const updated = [...prev];
                    const idx = updated.findIndex(m => m.id === messageId);
                    if (idx !== -1) {
                        updated[idx] = {
                            ...updated[idx],
                            start_at: response.started_at,
                            end_at: response.ended_at,
                            isStreaming: false,
                        };
                    }
                    return updated;
                });
            }
        }, 100);
    }
    

    useImperativeHandle(ref, () => ({
        handleFinalTranscript,
    }));

    return (
        <div style={{ height: '40vh', display: 'flex', marginRight: '20px', flexDirection: 'column', borderRadius: '20px', width: isMobile || isTablet ? '100%' : '50vw' }}>
            <div style={{
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: '600',
                marginBottom: '10px',
                textAlign: 'center',
                flexShrink: 0,
            }}>
                Chat History
            </div>

            <div style={{
                borderBottomColor: Colors.SECONDARY_TEXT_COLOR,
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                width: '100%',
            }} />

            <div ref={chatContainerRef} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                flex: 1,
                overflowY: 'auto',
                borderRadius: '8px',
            }}>
                {loadMoreChatHistoryBySessionTokenLoading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        margin: '5px 0'
                    }}>
                        <InsiderLoadingSpinner 
                            isVisible={true}
                            wrapperStyle={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '60px',
                                height: '60px'
                            }}
                        />
                    </div>
                )}

                {chatHistoryLoading && !loadMoreChatHistoryBySessionTokenLoading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        margin: '10px 0'
                    }}>
                        <InsiderLoadingSpinner 
                            isVisible={true}
                            wrapperStyle={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100px',
                                height: '100px'
                            }}
                        />
                    </div>
                )}

                {chatHistory.chat_history.map((chat) => (
                    <div
                        key={chat.id}
                        style={{
                            display: 'flex',
                            justifyContent: chat.actor === ACTOR.INTERVIEWER ? 'flex-start' : 'flex-end',
                            marginBottom: '8px'
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '70%',
                                padding: '12px 16px',
                                borderRadius: '18px',
                                backgroundColor: chat.actor === ACTOR.USER ? Colors.ACCENT_COLOR : Colors.TEXT_WHITE_COLOR,
                                color: chat.actor === ACTOR.USER ? Colors.TEXT_WHITE_COLOR : Colors.PRIMARY_COLOR,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                wordWrap: 'break-word',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                fontSize: '12px',
                                opacity: 0.7,
                                marginBottom: '4px',
                                fontWeight: '500'
                            }}>
                                {chat.actor === ACTOR.USER ? 'You' : 'Interviewer'}
                            </div>
                            <div style={{ fontSize: isMobile ? '12px' : '14px', lineHeight: '1.4' }}>
                                {chat.transcript_text}
                            </div>
                            <div style={{
                                fontSize: '10px',
                                opacity: 0.6,
                                color: Colors.SECONDARY_TEXT_COLOR,
                                marginTop: '4px',
                                textAlign: 'right'
                            }}>
                                {chat.start_at && chat.end_at ? `${chat.start_at} - ${chat.end_at}` : chat.start_at || ''}
                            </div>
                        </div>
                    </div>
                ))}

                {chatOrder.map((chat, index) => {
                    if (!chat || chatHistoryLoading) return null;

                    if (chat.isTyping && !isUserTurn) {
                        return (
                            <div key={chat.id || index} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    height: '60px',
                                    borderRadius: '18px',
                                    color: Colors.SECONDARY_TEXT_COLOR,
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <span style={{ fontSize: isMobile ? '12px' : '16px', opacity: 0.7, marginBottom: '4px', fontWeight: '500' }}>
                                        is typing
                                    </span>
                                    <span style={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        backgroundColor: Colors.SECONDARY_TEXT_COLOR,
                                        animation: 'blink 1.4s infinite both'
                                    }}></span>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: Colors.SECONDARY_TEXT_COLOR,
                                        animation: 'blink 1.4s infinite both',
                                        animationDelay: '0.2s'
                                    }}></span>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: Colors.SECONDARY_TEXT_COLOR,
                                        animation: 'blink 1.4s infinite both',
                                        animationDelay: '0.4s'
                                    }}></span>
                                </div>
                            </div>
                        );
                    }

                    if (!chat.isTyping)  {
                        return (
                            <div key={chat.id || index} style={{ display: 'flex', justifyContent: chat.actor === ACTOR.INTERVIEWER ? 'flex-start' : 'flex-end' }}>
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: '18px',
                                    backgroundColor: chat.actor === ACTOR.USER ? Colors.ACCENT_COLOR : Colors.TEXT_WHITE_COLOR,
                                    color: chat.actor === ACTOR.USER ? Colors.TEXT_WHITE_COLOR : Colors.PRIMARY_COLOR,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    wordWrap: 'break-word',
                                }}>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px', fontWeight: 500 }}>
                                        {chat.actor === ACTOR.USER ? 'You' : 'Interviewer'}
                                    </div>
                                    <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                                        {chat.transcript_text}
                                        {chat.isStreaming && (
                                            <span style={{
                                                display: 'inline-block',
                                                width: '2px',
                                                height: '16px',
                                                backgroundColor: chat.actor === ACTOR.USER ? Colors.TEXT_WHITE_COLOR : Colors.PRIMARY_COLOR,
                                                marginLeft: '2px',
                                                animation: 'blink 1s infinite'
                                            }}></span>
                                        )}
                                    </div>
                                    <div style={{
                                    fontSize: '10px',
                                    opacity: 0.6,
                                    marginTop: '4px',
                                    textAlign: 'right'
                                    }}>
                                        {chat.start_at && chat.end_at ? `${chat.start_at} - ${chat.end_at}` : chat.start_at || ''}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
});

ChatHistory.displayName = 'ChatHistory';

export default ChatHistory;
