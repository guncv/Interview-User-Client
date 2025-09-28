import React, { useEffect, useState, useRef, useCallback } from 'react';
import font from '../../assets/styles/Font';
import type { CSSProperties } from 'react';
import type { ChatHistoryWithEvaluation } from '../../interface/interviewInterface';
import TranscriptMessage from './TranscriptMessage';
import { Colors } from '../../assets/styles';
import { getChatHistoryBySessionIDWithEvaluation, setLoadMoreChatHistoryLoading } from '../../actions/interviewAction';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../reducers/rootReducer';
import { MessageCircle, Clock, Mic } from 'lucide-react';
import { useContextProvider } from '../layout/ContextProvider';
import InsiderLoadingSpinner from './InsiderLoadingSpinner';

interface ChatContainerProps {
    showFeedback?: boolean;
    session_id: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
    showFeedback = false,
    session_id,
}) => {
    const [expandedFeedback, setExpandedFeedback] = useState<{ [key: string]: boolean }>({});
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const {isMobile} = useContextProvider();

    const { chatHistoryBySessionIDWithEvaluation, chatHistoryBySessionIDWithEvaluationLoading, loadMoreChatHistoryLoading } = useSelector((state: RootState) => state.interview);

    useEffect(() => {
        dispatch(getChatHistoryBySessionIDWithEvaluation({ session_id: session_id, turn_no: null }));
        setHasMoreMessages(true);
        setIsLoadingMore(false);
    }, [session_id]);

    const handleFeedbackToggle = (messageId: string) => {
        setExpandedFeedback(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    const loadMoreMessages = useCallback(() => {
        if (isLoadingMore || !hasMoreMessages || chatHistoryBySessionIDWithEvaluationLoading) {
            return;
        }

        setIsLoadingMore(true);
        dispatch(setLoadMoreChatHistoryLoading(true));
        dispatch(getChatHistoryBySessionIDWithEvaluation({ 
            session_id: session_id, 
            turn_no:chatHistoryBySessionIDWithEvaluation.cursor_turn_next
        }));
    }, [dispatch, session_id, isLoadingMore, hasMoreMessages, chatHistoryBySessionIDWithEvaluationLoading, chatHistoryBySessionIDWithEvaluation.cursor_turn_next]);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    
        const shouldLoadMore = (scrollPercentage > 0.8 || distanceFromBottom < 100) && 
            !isLoadingMore && hasMoreMessages
        
        if (shouldLoadMore) {            
            loadMoreMessages();
        }
    }, [loadMoreMessages, isLoadingMore, hasMoreMessages, chatHistoryBySessionIDWithEvaluation.chat_history.length]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (!loadMoreChatHistoryLoading && isLoadingMore) {
            setIsLoadingMore(false);
            
            if (chatHistoryBySessionIDWithEvaluation.cursor_turn_next === 0) {
                setHasMoreMessages(false);
            }
        }
    }, [loadMoreChatHistoryLoading, isLoadingMore, chatHistoryBySessionIDWithEvaluation.cursor_turn_next]);

    const containerStyle: CSSProperties = {
        height: '100vh',
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        minHeight: '400px',
        maxHeight: 'calc(100vh - 200px)'
    };

    const emptyStateStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        textAlign: 'center',
        height: '80%',
        minHeight: '300px', 
        margin: '20px 0'
    };

    const iconContainerStyle: CSSProperties = {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: isMobile ? '' : Colors.ACCENT_COLOR_LIGHT ,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        opacity: 0.8
    };

    const titleStyle: CSSProperties = {
        fontSize: isMobile ? '16px' : '20px',
        color: Colors.PRIMARY_COLOR,
        marginBottom: '20px',
        margin: 0
    };

    const subtitleStyle: CSSProperties = {
        fontSize: isMobile ? '12px' : '14px',
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        marginBottom: '15px',
        lineHeight: '1.5',
        maxWidth: '300px',
        margin: '0 0 20px 0'
    };

    const featureListStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '6px' : '8px',
        alignItems: 'center',
        marginTop: '20px'
    };

    const featureItemStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: isMobile ? '10px' : '12px',
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular
    };

    if (chatHistoryBySessionIDWithEvaluationLoading) {
        return <InsiderLoadingSpinner 
        isVisible={chatHistoryBySessionIDWithEvaluationLoading} 
        wrapperStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }} />;
    }

    return (
        <div style={containerStyle} ref={containerRef}>
            {chatHistoryBySessionIDWithEvaluation.chat_history.length > 0 ? (
                <>
                    {chatHistoryBySessionIDWithEvaluation.chat_history.map((chatHistory: ChatHistoryWithEvaluation) => (
                        <div
                            key={chatHistory.id}
                            style={{
                                borderRadius: '8px',
                                padding: '2px',
                                transition: 'all 0.2s ease',
                                margin: '1px 0'
                            }}
                        >
                            <TranscriptMessage
                                message={chatHistory}
                                showFeedback={showFeedback && expandedFeedback[chatHistory.id]}
                                onFeedbackToggle={handleFeedbackToggle}
                            />
                        </div>
                    ))}

                    {(isLoadingMore || loadMoreChatHistoryLoading) && (
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
                </>
            ) : (
                <div style={emptyStateStyle}>
                    <div style={iconContainerStyle}>
                        <MessageCircle size={isMobile ? 30 : 40} color={Colors.ACCENT_COLOR} />
                    </div>
                    
                    <h3 style={titleStyle}>
                        No Interview Transcript Yet
                    </h3>
                    
                    <p style={subtitleStyle}>
                        The interview transcript will appear here once the conversation begins. 
                        You'll be able to see the full dialogue and get detailed feedback.
                    </p>
                    
                    <div style={featureListStyle}>
                        <div style={featureItemStyle}>
                            <Mic size={14} color={Colors.ACCENT_COLOR} />
                            <span>Real-time speech recognition</span>
                        </div>
                        <div style={featureItemStyle}>
                            <MessageCircle size={14} color={Colors.ACCENT_COLOR} />
                            <span>Interactive conversation flow</span>
                        </div>
                        <div style={featureItemStyle}>
                            <Clock size={14} color={Colors.ACCENT_COLOR} />
                            <span>Detailed performance analytics</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatContainer;
