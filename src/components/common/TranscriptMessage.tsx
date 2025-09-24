import React from 'react';
import font from '../../assets/styles/Font';
import type { CSSProperties } from 'react';
import type { ChatHistoryWithEvaluation } from '../../interface/interviewInterface';
import { Colors, Size } from '../../assets/styles';

interface TranscriptMessageProps {
    message: ChatHistoryWithEvaluation;
    showFeedback?: boolean;
    onFeedbackToggle?: (messageId: string) => void;
}

const TranscriptMessage: React.FC<TranscriptMessageProps> = ({
    message,
    showFeedback = false,
    onFeedbackToggle
}) => {
    const isUser = message.actor === 'user';
    const hasFeedback = isUser && (message.evaluation !== null || message.corrected_sentence !== null);

    const messageContainerStyle: CSSProperties = {
        marginBottom: '8px',
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start'
    };

    const messageBubbleStyle: CSSProperties = {
        maxWidth: '90%',
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: '8px',
        alignItems: 'flex-start'
    };

    const avatarStyle: CSSProperties = {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: isUser ? Colors.ACCENT_COLOR : Colors.BORDER_COLOR,
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
        backgroundColor: isUser ? Colors.ACCENT_COLOR : Colors.CONTENT_HOVER_COLOR,
        color: isUser ? 'white' : '#1F2937',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        fontFamily: font.Regular,
        cursor: 'pointer',
        fontSize: '14px',
        lineHeight: '1.5',
        wordWrap: 'break-word',
        maxWidth: '100%'
    };

    const headerStyle: CSSProperties = {
        fontFamily: font.Medium,
        fontSize: '11px',
        color: Colors.SECONDARY_TEXT_COLOR,
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap'
    };

    const phraseNameStyle: CSSProperties = {
        fontSize: '9px',
        padding: '2px 6px',
        borderRadius: '8px',
        fontFamily: font.Medium,
        marginLeft: '4px'
    };

    const timestampStyle: CSSProperties = {
        fontSize: '10px',
        color: Colors.SECONDARY_TEXT_COLOR,
        marginTop: '4px',
        fontFamily: font.Regular
    };

    const feedbackContainerStyle: CSSProperties = {
        marginTop: '8px',
        padding: '20px',
        backgroundColor: Colors.LECTURE_CONTENT_PART_COLOR,
        borderRadius: '8px',
        border: `1px solid ${Colors.BORDER_COLOR}`,
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

    const improvementTextStyle: CSSProperties = {
        fontFamily: font.Regular,
        fontSize: '13px',
        color: Colors.PRIMARY_COLOR,
        fontStyle: 'italic',
        marginTop: '8px',
        padding: '8px',
        backgroundColor: Colors.LECTURE_CONTENT_PART_COLOR,
        borderRadius: '4px',
        borderLeft: `3px solid ${Colors.ACCENT_COLOR}`
    };

    const categoryItemStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        padding: '4px 0',
        fontSize: '12px',
        gap: '10px',
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
                        {message && (
                            <span style={{...phraseNameStyle, color: message.current_state_color, backgroundColor: message.current_state_color + "20"}}>
                                {message.current_state}
                            </span>
                        )}
                        {hasFeedback && (
                            <button
                                onClick={() => onFeedbackToggle?.(message.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: Colors.ACCENT_COLOR,
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
                    <div style={textBubbleStyle} onClick={() => onFeedbackToggle?.(message.id)}>
                        {message.content}
                    </div>
                    <div style={timestampStyle}>
                        {message.start_at} - {message.end_at}
                    </div>

                {isUser && showFeedback && hasFeedback && (
                    <div style={feedbackContainerStyle}>
                        {message.evaluation !== null && message.evaluation.overall_score !== undefined && message.evaluation.overall_score !== null && (
                            <div style={scoreStyle}>
                                <span style={{ fontSize: Size.Medium, color: Colors.SECONDARY_TEXT_COLOR }}>Overall Score:</span>
                                <div
                                    style={{
                                        ...scoreBadgeStyle,
                                        fontSize: "14px",
                                        color: message.evaluation.overall_color
                                    }}
                                >
                                    {message.evaluation.overall_score}/5
                                </div>
                            </div>
                        )}

                        {message.corrected_sentence && (
                            <div style={improvementTextStyle}>
                                <strong>Improved:</strong> {message.corrected_sentence}
                            </div>
                        )}

                        {message.evaluation && message.evaluation.scores && message.evaluation.scores.length > 0 && (
                            <div>
                                <div style={{ marginTop: '8px' }}>
                                    {message.evaluation.scores.map((category, index) => (
                                        <div key={index} style={{ 
                                            marginBottom: '12px', 
                                            padding: '8px', 
                                            backgroundColor: Colors.LECTURE_CONTENT_PART_COLOR,
                                            borderRadius: '6px',
                                            border: `1px solid ${Colors.BORDER_COLOR}`
                                        }}>
                                            <div style={categoryItemStyle}>
                                                <span style={{ color: Colors.SECONDARY_TEXT_COLOR, fontFamily: font.Medium }}>{category.criterion_name}:</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span
                                                        style={{
                                                            color: category.score_color,
                                                            fontFamily: font.Medium
                                                        }}
                                                    >
                                                        {category.score}/5
                                                    </span>
                                                </div>
                                            </div>

                                            {category.comment_md && (
                                                <div style={{ 
                                                    marginTop: '6px', 
                                                    fontSize: "12px", 
                                                    color: Colors.PRIMARY_COLOR,
                                                    fontStyle: 'italic',
                                                    padding: '6px',
                                                    borderRadius: '4px',
                                                    borderLeft: `3px solid ${Colors.ACCENT_COLOR}`
                                                }}>
                                                    <strong>Comment:</strong> {category.comment_md}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
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
