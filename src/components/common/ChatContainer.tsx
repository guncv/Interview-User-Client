import React, { useEffect, useState } from 'react';
import font from '../../assets/styles/Font';
import type { CSSProperties } from 'react';
import type { ChatHistoryWithEvaluation } from '../../interface/interviewInterface';
import TranscriptMessage from './TranscriptMessage';
import { Colors } from '../../assets/styles';
import { getChatHistoryBySessionIDWithEvaluation } from '../../actions/interviewAction';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../reducers/rootReducer';
import { MessageCircle, Clock, Mic } from 'lucide-react';

interface ChatContainerProps {
    showFeedback?: boolean;
    session_id: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
    showFeedback = false,
    session_id,
}) => {
    const [expandedFeedback, setExpandedFeedback] = useState<{ [key: string]: boolean }>({});
    const dispatch = useDispatch();

    const { chatHistoryBySessionIDWithEvaluation } = useSelector((state: RootState) => state.interview);

    useEffect(() => {
        dispatch(getChatHistoryBySessionIDWithEvaluation({ session_id: session_id, turn_no: null }));
    }, []);

    const handleFeedbackToggle = (messageId: string) => {
        setExpandedFeedback(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

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
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        opacity: 0.8
    };

    const titleStyle: CSSProperties = {
        fontSize: '20px',
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        marginBottom: '12px',
        margin: 0
    };

    const subtitleStyle: CSSProperties = {
        fontSize: '14px',
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        marginBottom: '20px',
        lineHeight: '1.5',
        maxWidth: '300px',
        margin: '0 0 20px 0'
    };

    const featureListStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
        marginTop: '20px'
    };

    const featureItemStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular
    };

    return (
        <div style={containerStyle}>
            {chatHistoryBySessionIDWithEvaluation.chat_history.length > 0 ? (
                chatHistoryBySessionIDWithEvaluation.chat_history.map((chatHistory: ChatHistoryWithEvaluation) => (
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
                ))
            ) : (
                <div style={emptyStateStyle}>
                    <div style={iconContainerStyle}>
                        <MessageCircle size={40} color={Colors.ACCENT_COLOR} />
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
