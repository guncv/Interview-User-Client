import React, { useState } from 'react';
import font from '../../assets/styles/Font';
import type { CSSProperties } from 'react';
import type { ChatHistory } from '../../interface/interviewInterface';

interface TranscriptMessageProps {
    message: ChatHistory;
    showFeedback?: boolean;
    onFeedbackToggle?: (messageId: string) => void;
}

const TranscriptMessage: React.FC<TranscriptMessageProps> = ({ 
    message, 
    showFeedback = false, 
    onFeedbackToggle 
}) => {
    const [showImprovement, setShowImprovement] = useState(false);
    const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);

    const isUser = message.actor === 'user';
    const hasFeedback = isUser && (message.feedback_score !== undefined || message.improved_sentence);

    const getScoreColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return '#10B981'; // green
        if (percentage >= 60) return '#F59E0B'; // yellow
        return '#EF4444'; // red
    };

    const getScoreLabel = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 60) return 'Good';
        if (percentage >= 40) return 'Fair';
        return 'Needs Improvement';
    };

    const messageContainerStyle: CSSProperties = {
        marginBottom: '8px',
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start'
    };

    const messageBubbleStyle: CSSProperties = {
        maxWidth: '70%',
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: '8px',
        alignItems: 'flex-start'
    };

    const avatarStyle: CSSProperties = {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: isUser ? '#8B5CF6' : '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        fontFamily: font.Medium,
        flexShrink: 0
    };

    const contentStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start'
    };

    const textBubbleStyle: CSSProperties = {
        backgroundColor: isUser ? '#8B5CF6' : '#F3F4F6',
        color: isUser ? 'white' : '#1F2937',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        fontFamily: font.Regular,
        fontSize: '14px',
        lineHeight: '1.5',
        wordWrap: 'break-word',
        maxWidth: '100%'
    };

    const headerStyle: CSSProperties = {
        fontFamily: font.Medium,
        fontSize: '11px',
        color: '#6B7280',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    };

    const timestampStyle: CSSProperties = {
        fontSize: '10px',
        color: '#9CA3AF',
        marginTop: '4px',
        fontFamily: font.Regular
    };

    const feedbackContainerStyle: CSSProperties = {
        marginTop: '8px',
        padding: '12px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        maxWidth: '100%',
        width: '100%'
    };

    const scoreStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
    };

    const scoreBadgeStyle: CSSProperties = {
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '10px',
        fontFamily: font.Medium,
        color: 'white'
    };

    const improvementButtonStyle: CSSProperties = {
        background: 'none',
        border: '1px solid #D1D5DB',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontFamily: font.Medium,
        color: '#6B7280',
        cursor: 'pointer',
        marginRight: '8px'
    };

    const improvementTextStyle: CSSProperties = {
        fontFamily: font.Regular,
        fontSize: '13px',
        color: '#374151',
        fontStyle: 'italic',
        marginTop: '8px',
        padding: '8px',
        backgroundColor: '#F3F4F6',
        borderRadius: '4px',
        borderLeft: '3px solid #8B5CF6'
    };

    const categoryItemStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
        fontSize: '11px'
    };

    return (
        <div style={messageContainerStyle}>
            <div style={messageBubbleStyle}>
                <div style={avatarStyle}>
                    {isUser ? 'U' : 'M'}
                </div>
                <div style={contentStyle}>
                    <div style={headerStyle}>
                        <span>{isUser ? 'You' : 'Mike'}</span>
                        {hasFeedback && (
                            <button
                                onClick={() => onFeedbackToggle?.(message.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8B5CF6',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    fontFamily: font.Medium,
                                    textDecoration: 'underline'
                                }}
                            >
                                {showFeedback ? 'Hide feedback' : 'Show feedback'}
                            </button>
                        )}
                    </div>
                    <div style={textBubbleStyle}>
                        {message.transcript_text}
                    </div>
                    <div style={timestampStyle}>
                        {message.start_at}
                    </div>

                {/* Feedback Section - Only for user messages */}
                {isUser && showFeedback && hasFeedback && (
                    <div style={feedbackContainerStyle}>
                        {/* Overall Score */}
                        {message.feedback_score !== undefined && message.max_feedback_score && (
                            <div style={scoreStyle}>
                                <span style={{ fontSize: '11px', color: '#6B7280' }}>Overall Score:</span>
                                <div
                                    style={{
                                        ...scoreBadgeStyle,
                                        backgroundColor: getScoreColor(message.feedback_score, message.max_feedback_score)
                                    }}
                                >
                                    {message.feedback_score}/{message.max_feedback_score} - {getScoreLabel(message.feedback_score, message.max_feedback_score)}
                                </div>
                            </div>
                        )}

                        {/* Improved Sentence */}
                        {message.improved_sentence && (
                            <div>
                                <button
                                    onClick={() => setShowImprovement(!showImprovement)}
                                    style={improvementButtonStyle}
                                >
                                    {showImprovement ? 'Hide' : 'Show'} Improved Version
                                </button>
                                {showImprovement && (
                                    <div style={improvementTextStyle}>
                                        <strong>Improved:</strong> {message.improved_sentence}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Detailed Category Feedback */}
                        {message.feedback_categories && message.feedback_categories.length > 0 && (
                            <div>
                                <button
                                    onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
                                    style={improvementButtonStyle}
                                >
                                    {showDetailedFeedback ? 'Hide' : 'Show'} Detailed Feedback
                                </button>
                                {showDetailedFeedback && (
                                    <div style={{ marginTop: '8px' }}>
                                        {message.feedback_categories.map((category, index) => (
                                            <div key={index} style={categoryItemStyle}>
                                                <span style={{ color: '#6B7280' }}>{category.category}:</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span
                                                        style={{
                                                            color: getScoreColor(category.score, category.max_score),
                                                            fontFamily: font.Medium
                                                        }}
                                                    >
                                                        {category.score}/{category.max_score}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {message.feedback_categories.some(cat => cat.improvement_suggestion) && (
                                            <div style={{ marginTop: '8px', fontSize: '10px', color: '#6B7280' }}>
                                                {message.feedback_categories
                                                    .filter(cat => cat.improvement_suggestion)
                                                    .map((cat, index) => (
                                                        <div key={index} style={{ marginBottom: '2px' }}>
                                                            <strong>{cat.category}:</strong> {cat.improvement_suggestion}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default TranscriptMessage;
