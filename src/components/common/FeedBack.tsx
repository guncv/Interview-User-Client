import React, { useState } from 'react';
import font from '../../assets/styles/Font';
import type { CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import { useContextProvider } from '../layout/ContextProvider';

interface FeedBackProps {
    onSubmitClick: (rating: number, comment: string | null) => void;
    alreadyFeedback?: boolean;
    FeedBackError?: string;
}

const FeedBack: React.FC<FeedBackProps> = ({
    onSubmitClick,
    alreadyFeedback = false,
    FeedBackError = '',
}) => {
    const { isMobile } = useContextProvider();
    const [isExpanded, setIsExpanded] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');

    const handleSubmitClick = () => {
        if (rating) {
            onSubmitClick(rating, comment || null);
        }
    };

    const handleExpandClick = () => {
        console.log('handleExpandClick');
        setIsExpanded(!isExpanded);
    };

    const containerStyle: CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column'
    };

    const headerStyle: CSSProperties = {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    };

    const feedbackInputStyle: CSSProperties = {
        flex: 1,
        padding: '12px 16px',
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        fontFamily: font.Regular,
        fontSize: isMobile ? '12px' : '14px',
        borderColor: '#D1D5DB',
        backgroundColor: isExpanded ? '#F9FAFB' : 'white',
        outline: 'none',
        cursor: 'pointer',
        textAlign: 'left'
    };

    const thankYouButtonStyle: CSSProperties = {
        flex: 1,
        padding: '12px 16px',
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        fontFamily: font.Regular,
        fontSize: isMobile ? '12px' : '14px',
        borderColor: Colors.ACCENT_COLOR,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        outline: 'none',
        cursor: 'pointer',
        textAlign: 'left'
    };

    const expandableContainerStyle: CSSProperties = {
        marginTop: '16px',
        padding: '16px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        display: isExpanded ? 'flex' : 'none',
        flexDirection: 'column',
        gap: '16px'
    };

    const ratingContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const ratingLabelStyle: CSSProperties = {
        fontFamily: font.Medium,
        fontSize: isMobile ? '12px' : '14px',
        color: '#374151'
    };

    const ratingButtonsStyle: CSSProperties = {
        display: 'flex',
        gap: '8px'
    };

    const ratingButtonStyle: CSSProperties = {
        width: isMobile ? '30px' : '40px',
        height: isMobile ? '30px' : '40px',
        borderRadius: '50%',
        border: '2px solid #D1D5DB',
        backgroundColor: 'white',
        color: '#6B7280',
        fontFamily: font.Bold,
        fontSize: isMobile ? '12px' : '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const ratingButtonSelectedStyle: CSSProperties = {
        ...ratingButtonStyle,
        backgroundColor: Colors.ACCENT_COLOR,
        borderColor: Colors.ACCENT_COLOR,
        color: 'white'
    };

    const commentContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const commentLabelStyle: CSSProperties = {
        fontFamily: font.Medium,
        fontSize: isMobile ? '12px' : '14px',
        color: '#374151'
    };

    const commentTextareaStyle: CSSProperties = {
        padding: '12px',
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        fontFamily: font.Regular,
        outline: 'none',
        fontSize: isMobile ? '12px' : '14px',
        resize: 'vertical',
        minHeight: '80px',
        backgroundColor: 'white'
    };

    const submitButtonStyle: CSSProperties = {
        padding: isMobile ? '10px 16px' : '12px 24px',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontFamily: font.Medium,
        fontSize: isMobile ? '12px' : '14px',
        transition: 'all 0.2s ease',
        alignSelf: 'flex-start'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
            {alreadyFeedback ?
                <>
                    <button style={thankYouButtonStyle}>
                        We've already received your feedback. Thank you!
                    </button>
                </>
                :
                <>
                    <button
                        style={feedbackInputStyle}
                        onClick={() => handleExpandClick()}
                    >
                        Click here to leave feedback
                    </button>
                </>
            }
            </div>
            
            {isExpanded && !alreadyFeedback && (
                <div style={expandableContainerStyle}>
                    <div style={ratingContainerStyle}>
                        <label style={ratingLabelStyle}>Rate this experience (1-5):</label>
                        <div style={ratingButtonsStyle}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={rating === star ? ratingButtonSelectedStyle : ratingButtonStyle}
                                    onMouseEnter={(e) => {
                                        if (rating !== star) {
                                            e.currentTarget.style.backgroundColor = '#F3F4F6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (rating !== star) {
                                            e.currentTarget.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    {star}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={commentContainerStyle}>
                        <label style={commentLabelStyle}>Additional comments (optional):</label>
                        <textarea
                            placeholder="Share your thoughts about this experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={commentTextareaStyle}
                        />
                    </div>

                    <button
                        onClick={handleSubmitClick}
                        style={{...submitButtonStyle, backgroundColor: rating ? Colors.ACCENT_COLOR : '#D1D5DB', cursor: rating ? 'pointer' : 'default' }}
                        disabled={!rating}
                    >
                        Submit Feedback
                    </button>
                    {FeedBackError && <div style={{ color: 'red', fontFamily: font.Regular, fontSize: '14px' }}>{FeedBackError}</div>}
                </div>
                )}
                
            </div>
    );
};

export default FeedBack;
