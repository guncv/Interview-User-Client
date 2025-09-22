import React, { useState } from 'react';
import font from '../../assets/styles/Font';
import type { CSSProperties } from 'react';
import type { ChatHistory } from '../../interface/interviewInterface';
import TranscriptMessage from './TranscriptMessage';

interface ChatContainerProps {
    transcript: ChatHistory[];
    showFeedback?: boolean;
    onMessageClick?: (messageId: string) => void;
    selectedMessageId?: string | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
    transcript,
    showFeedback = false,
    onMessageClick,
    selectedMessageId
}) => {
    const [expandedFeedback, setExpandedFeedback] = useState<{ [key: string]: boolean }>({});

    const handleFeedbackToggle = (messageId: string) => {
        setExpandedFeedback(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    const handleMessageClick = (messageId: string) => {
        onMessageClick?.(messageId);
    };

    const containerStyle: CSSProperties = {
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        minHeight: '500px'
    };

    const emptyStateStyle: CSSProperties = {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#6B7280',
        fontFamily: font.Regular
    };

    return (
        <div style={containerStyle}>
            {transcript.length > 0 ? (
                transcript.map((message) => (
                    <div
                        key={message.id}
                        onClick={() => handleMessageClick(message.id)}
                        style={{
                            cursor: 'pointer',
                            borderRadius: '8px',
                            padding: selectedMessageId === message.id ? '6px' : '2px',
                            backgroundColor: selectedMessageId === message.id ? '#F3F4F6' : 'transparent',
                            transition: 'all 0.2s ease',
                            margin: '1px 0'
                        }}
                    >
                        <TranscriptMessage
                            message={message}
                            showFeedback={showFeedback && expandedFeedback[message.id]}
                            onFeedbackToggle={handleFeedbackToggle}
                        />
                    </div>
                ))
            ) : (
                <div style={emptyStateStyle}>
                    No transcript available
                </div>
            )}
        </div>
    );
};

export default ChatContainer;
