import React, { useState } from 'react';
import font from '../../assets/styles/Font';
import type { CSSProperties } from 'react';
import type { ChatHistory } from '../../interface/interviewInterface';
import TranscriptMessage from './TranscriptMessage';
import { Colors } from '../../assets/styles';

interface ChatContainerProps {
    transcript: ChatHistory[];
    showFeedback?: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
    transcript,
    showFeedback = false,
}) => {
    const [expandedFeedback, setExpandedFeedback] = useState<{ [key: string]: boolean }>({});

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
        textAlign: 'center',
        padding: '40px 20px',
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular
    };

    return (
        <div style={containerStyle}>
            {transcript.length > 0 ? (
                transcript.map((message) => (
                    <div
                        key={message.id}
                        style={{
                            borderRadius: '8px',
                            padding: '2px',
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
