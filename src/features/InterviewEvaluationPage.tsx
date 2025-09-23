import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import font from '../assets/styles/Font';
import type { CSSProperties } from 'react';
import type { InterviewEvaluation, ChatHistory } from '../interface/interviewInterface';
import ContentLayout from '../components/layout/ContentLayout';
import FeedBack from '../components/common/FeedBack';
import ChatContainer from '../components/common/ChatContainer';
import { Trash } from 'lucide-react';
import { Colors } from '../assets/styles';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../reducers/rootReducer';
import { createReviewComment } from '../actions/reviewCommenAction';
import { safeNavigate } from '../utils/navigation';
import { deleteInterviewSessionByIdAction } from '../actions/interviewAction';

const InterviewEvaluationPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>(); 
    const dispatch = useDispatch();
    
    const [activeTab, setActiveTab] = useState<'coaching' | 'analytics'>('coaching');
    const [showInsights, setShowInsights] = useState<{ [key: string]: boolean }>({});
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

    const alreadyFeedback = useSelector((state: RootState) => state.reviewComment.alreadyFeedback);
    const feedBackError = useSelector((state: RootState) => state.reviewComment.error);

    const mockEvaluation: InterviewEvaluation = {
        id: '1',
        session_id: sessionId || '',
        overall_score: 20,
        status: 'completed',
        created_at: '2025-09-23T12:25:00Z',
        feedback: {
            coaching: [
                {
                    category: 'Active Listening',
                    score: 1,
                    max_score: 5,
                    description: 'You did not demonstrate active listening during this brief conversation, as you didn\'t engage with the content your conversation partner shared or ask any follow-up questions.',
                    insights: [
                        'Try to ask clarifying questions when you don\'t understand something',
                        'Show engagement by nodding or providing verbal acknowledgments',
                        'Paraphrase what the interviewer said to confirm understanding'
                    ]
                },
                {
                    category: 'Use STAR',
                    score: 1,
                    max_score: 5,
                    description: 'Your responses lacked structure and specific examples.',
                    insights: [
                        'Structure your answers using Situation, Task, Action, Result',
                        'Provide specific examples from your experience',
                        'Quantify your achievements when possible'
                    ],
                    subcategories: [
                        { name: 'Situation', score: 1, max_score: 5, description: 'No clear situation described' },
                        { name: 'Task', score: 1, max_score: 5, description: 'No specific task identified' },
                        { name: 'Action', score: 1, max_score: 5, description: 'No clear actions taken' },
                        { name: 'Result', score: 1, max_score: 5, description: 'No measurable results provided' }
                    ]
                }
            ],
            strengths: [
                'Showed enthusiasm for the position',
                'Maintained professional demeanor'
            ],
            improvements: [
                'Practice the STAR method for behavioral questions',
                'Work on active listening skills',
                'Prepare specific examples from your experience'
            ],
            general_feedback: 'A few more AI Speech Coach comments are loading...'
        },
        analytics: {
            total_duration: 39,
            speaking_time: {
                user: 15,
                interviewer: 24
            },
            response_times: [2.5, 3.2, 1.8],
            keywords_used: ['good', 'yeah', 'um'],
            confidence_score: 3.2,
            clarity_score: 2.8
        }
    };

    const mockTranscript: ChatHistory[] = [
        {
            id: '1',
            turn_no: 1,
            actor: 'interviewer',
            transcript_text: 'Hi, welcome to our interview for the Sample Associate position at Costco. How are you doing today?',
            start_at: '0:02',
            end_at: '0:12',
            created_at: '2025-09-23T12:25:02Z'
        },
        {
            id: '2',
            turn_no: 2,
            actor: 'user',
            transcript_text: 'Yeah. They also, um, um, good. Yeah.',
            start_at: '0:12',
            end_at: '0:27',
            created_at: '2025-09-23T12:25:12Z',
            feedback_score: 2,
            max_feedback_score: 5,
            improved_sentence: 'I\'m doing well, thank you for asking. I\'m excited about the opportunity to discuss the Sample Associate position with you today.',
            feedback_categories: [
                {
                    category: 'Clarity',
                    score: 1,
                    max_score: 5,
                    description: 'Response was unclear and contained many filler words',
                    improvement_suggestion: 'Practice speaking more clearly and reduce filler words like "um" and "yeah"'
                },
                {
                    category: 'Professionalism',
                    score: 2,
                    max_score: 5,
                    description: 'Response lacked professional tone and structure',
                    improvement_suggestion: 'Use a more professional greeting and express enthusiasm for the opportunity'
                },
                {
                    category: 'Engagement',
                    score: 3,
                    max_score: 5,
                    description: 'Showed some engagement but could be more enthusiastic',
                    improvement_suggestion: 'Express more enthusiasm and ask a follow-up question about the role'
                }
            ]
        },
        {
            id: '3',
            turn_no: 3,
            actor: 'interviewer',
            transcript_text: 'Can you tell me about a time when you dealt with a difficult customer or situation?',
            start_at: '0:27',
            end_at: '0:39',
            created_at: '2025-09-23T12:25:27Z'
        },
        {
            id: '4',
            turn_no: 4,
            actor: 'user',
            transcript_text: 'Well, there was this one time when a customer was really mad about something and I just, you know, tried to help them out.',
            start_at: '0:39',
            end_at: '0:52',
            created_at: '2025-09-23T12:25:39Z',
            feedback_score: 3,
            max_feedback_score: 5,
            improved_sentence: 'I recall a situation where a customer was upset about a delayed order. I listened to their concerns, apologized for the inconvenience, and worked with our team to expedite their order while offering a discount for their trouble. The customer left satisfied and even wrote a positive review about our service.',
            feedback_categories: [
                {
                    category: 'STAR Method',
                    score: 2,
                    max_score: 5,
                    description: 'Response lacked structure and specific details',
                    improvement_suggestion: 'Use the STAR method: describe the Situation, Task, Action, and Result'
                },
                {
                    category: 'Specificity',
                    score: 2,
                    max_score: 5,
                    description: 'Response was too vague and lacked concrete details',
                    improvement_suggestion: 'Provide specific details about what happened, what you did, and the outcome'
                },
                {
                    category: 'Problem Solving',
                    score: 4,
                    max_score: 5,
                    description: 'Showed willingness to help but could be more specific about actions taken',
                    improvement_suggestion: 'Detail the specific steps you took to resolve the situation'
                }
            ]
        }
    ];

    const handlePracticeAgain = () => {
        safeNavigate('/create-interview');
    };

    const toggleInsights = (category: string) => {
        setShowInsights(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleSubmitClick = (rating: number, comment: string | null) => {
        console.log('rating', rating);
        console.log('comment', comment);
        dispatch(createReviewComment({
            session_id: sessionId || '',
            rating,
            comment
        }));
    };

    const getScoreColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return '#10B981';
        if (percentage >= 60) return '#F59E0B';
        return '#EF4444';
    };

    const handleDeleteInterviewSession = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        dispatch(deleteInterviewSessionByIdAction(sessionId || ''));
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const containerStyle: CSSProperties = {
        display: 'flex',
    };

    const mainContentStyle: CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    };

    const rightSidebarStyle: CSSProperties = {
        width: '400px',
        backgroundColor: 'white',
        borderLeft: '1px solid #E5E7EB',
        padding: '24px',
        overflowY: 'auto'
    };

    const headerStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '20px 40px'
    };

    const feedbackContainerStyle: CSSProperties = {
        flex: 1,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    };

    const tabStyle: CSSProperties = {
        padding: '12px 16px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderBottom: '2px solid transparent',
        fontFamily: font.Medium,
        fontSize: '14px'
    };

    const activeTabStyle: CSSProperties = {
        ...tabStyle,
        borderBottomColor: '#8B5CF6',
        color: '#8B5CF6'
    };

    const scoreCardStyle: CSSProperties = {
        backgroundColor: '#F3F4F6',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px'
    };

    const rubricItemStyle: CSSProperties = {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '12px',
        border: '1px solid #E5E7EB'
    };

    return (
        <ContentLayout>
            <div style={containerStyle}>
                <div style={mainContentStyle}>
                    <div style={headerStyle}>
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontFamily: font.Bold, 
                                fontSize: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                General Interview
                            </h1>
                            <p style={{ 
                                margin: '4px 0 0 0', 
                                color: '#6B7280', 
                                fontSize: '14px' 
                            }}>
                                September 23, 2025 at 12:25 AM
                            </p>
                        </div>

                        <div>
                            <button style={{ 
                                border: 'none',
                                padding: '8px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                transform: 'scale(1)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                            onClick={handleDeleteInterviewSession}
                            >
                                <Trash size={18} color={Colors.TEXT_ERROR_COLOR}/>
                            </button>
                        </div>
                    </div>

                    <div style={feedbackContainerStyle}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <FeedBack
                                onSubmitClick={handleSubmitClick}
                                alreadyFeedback={alreadyFeedback}
                                FeedBackError={feedBackError}
                            />
                            <ChatContainer
                                transcript={mockTranscript}
                                showFeedback={true}
                                onMessageClick={setSelectedMessageId}
                                selectedMessageId={selectedMessageId}
                            />
                        </div>
                    </div>
                </div>

                <div style={rightSidebarStyle}>
                    <div style={scoreCardStyle}>
                        <div style={{ 
                            fontFamily: font.Bold, 
                            fontSize: '16px', 
                            marginBottom: '8px',
                            color: '#1F2937'
                        }}>
                            Roleplay complete
                        </div>
                        <div style={{ 
                            fontFamily: font.Medium, 
                            fontSize: '14px', 
                            marginBottom: '12px',
                            color: '#6B7280'
                        }}>
                            Your score was {mockEvaluation.overall_score}%
                        </div>
                        <button 
                            onClick={handlePracticeAgain}
                            style={{ 
                                background: '#8B5CF6', 
                                color: 'white', 
                                border: 'none', 
                                padding: '8px 16px', 
                                borderRadius: '6px',
                                fontFamily: font.Medium,
                                cursor: 'pointer'
                            }}
                        >
                            Practice Again
                        </button>
                    </div>

                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                        <button 
                            onClick={() => setActiveTab('coaching')}
                            style={activeTab === 'coaching' ? activeTabStyle : tabStyle}
                        >
                            Coaching ({mockEvaluation.feedback.coaching.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('analytics')}
                            style={activeTab === 'analytics' ? activeTabStyle : tabStyle}
                        >
                            Analytics
                        </button>
                    </div>

                    {/* Coaching Content */}
                    {activeTab === 'coaching' && (
                        <div>
                            <div style={{ fontFamily: font.Bold, fontSize: '16px', marginBottom: '16px' }}>
                                Yoodli Rubric
                            </div>
                            
                            {mockEvaluation.feedback.coaching.map((item, index) => (
                                <div key={index} style={rubricItemStyle}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '8px'
                                    }}>
                                        <div style={{ fontFamily: font.Medium, fontSize: '14px' }}>
                                            {item.category}
                                        </div>
                                        <div style={{ 
                                            fontFamily: font.Bold, 
                                            fontSize: '14px',
                                            color: getScoreColor(item.score, item.max_score)
                                        }}>
                                            {item.score}/{item.max_score}
                                        </div>
                                    </div>
                                    
                                    <div style={{ 
                                        fontSize: '12px', 
                                        color: '#6B7280',
                                        marginBottom: '8px',
                                        lineHeight: '1.4'
                                    }}>
                                        {item.description}
                                    </div>

                                    {item.subcategories && (
                                        <div style={{ marginBottom: '8px' }}>
                                            {item.subcategories.map((sub, subIndex) => (
                                                <div key={subIndex} style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    fontSize: '12px',
                                                    marginBottom: '4px'
                                                }}>
                                                    <span style={{ color: '#6B7280' }}>{sub.name}:</span>
                                                    <span style={{ 
                                                        color: getScoreColor(sub.score, sub.max_score),
                                                        fontFamily: font.Medium
                                                    }}>
                                                        {sub.score}/{sub.max_score}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => toggleInsights(item.category)}
                                        style={{ 
                                            background: 'none', 
                                            border: 'none', 
                                            color: '#8B5CF6', 
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            fontFamily: font.Medium
                                        }}
                                    >
                                        {showInsights[item.category] ? 'Hide insights' : 'Show insights'} ↓
                                    </button>

                                    {showInsights[item.category] && (
                                        <div style={{ 
                                            marginTop: '8px', 
                                            padding: '8px', 
                                            backgroundColor: '#F9FAFB',
                                            borderRadius: '4px'
                                        }}>
                                            {item.insights.map((insight, insightIndex) => (
                                                <div key={insightIndex} style={{ 
                                                    fontSize: '12px', 
                                                    marginBottom: '4px',
                                                    color: '#374151'
                                                }}>
                                                    • {insight}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* General Feedback */}
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ 
                                    fontFamily: font.Medium, 
                                    fontSize: '14px', 
                                    marginBottom: '8px',
                                    color: '#1F2937'
                                }}>
                                    General Feedback
                                </div>
                                <div style={{ 
                                    fontSize: '12px', 
                                    color: '#6B7280',
                                    fontStyle: 'italic'
                                }}>
                                    {mockEvaluation.feedback.general_feedback}
                                </div>
                            </div>

                            {/* Strengths */}
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ 
                                    fontFamily: font.Medium, 
                                    fontSize: '14px', 
                                    marginBottom: '8px',
                                    color: '#1F2937',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span>👍</span>
                                    Strength
                                </div>
                                {mockEvaluation.feedback.strengths.map((strength, index) => (
                                    <div key={index} style={{ 
                                        fontSize: '12px', 
                                        color: '#374151',
                                        marginBottom: '4px'
                                    }}>
                                        • {strength}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Analytics Content */}
                    {activeTab === 'analytics' && (
                        <div>
                            <div style={{ fontFamily: font.Bold, fontSize: '16px', marginBottom: '16px' }}>
                                Analytics
                            </div>
                            
                            <div style={rubricItemStyle}>
                                <div style={{ fontFamily: font.Medium, fontSize: '14px', marginBottom: '8px' }}>
                                    Speaking Time
                                </div>
                                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                                    Total Duration: {Math.floor(mockEvaluation.analytics.total_duration / 60)}:{(mockEvaluation.analytics.total_duration % 60).toString().padStart(2, '0')}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span>You: {Math.floor(mockEvaluation.analytics.speaking_time.user / 60)}:{(mockEvaluation.analytics.speaking_time.user % 60).toString().padStart(2, '0')}</span>
                                    <span>Interviewer: {Math.floor(mockEvaluation.analytics.speaking_time.interviewer / 60)}:{(mockEvaluation.analytics.speaking_time.interviewer % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            <div style={rubricItemStyle}>
                                <div style={{ fontFamily: font.Medium, fontSize: '14px', marginBottom: '8px' }}>
                                    Performance Metrics
                                </div>
                                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                                    Average Response Time: {(mockEvaluation.analytics.response_times.reduce((a, b) => a + b, 0) / mockEvaluation.analytics.response_times.length).toFixed(1)}s
                                </div>
                                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                                    Confidence Score: {mockEvaluation.analytics.confidence_score}/5
                                </div>
                                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                    Clarity Score: {mockEvaluation.analytics.clarity_score}/5
                                </div>
                            </div>

                            <div style={rubricItemStyle}>
                                <div style={{ fontFamily: font.Medium, fontSize: '14px', marginBottom: '8px' }}>
                                    Keywords Used
                                </div>
                                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                    {mockEvaluation.analytics.keywords_used.join(', ')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Popup */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{
                            fontFamily: font.Bold,
                            fontSize: '18px',
                            marginBottom: '8px',
                            color: '#1F2937'
                        }}>
                            Delete Interview Session
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            marginBottom: '24px',
                            lineHeight: '1.5'
                        }}>
                            Are you sure you want to delete this interview session? This action cannot be undone.
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={cancelDelete}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #D1D5DB',
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    borderRadius: '6px',
                                    fontFamily: font.Medium,
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    backgroundColor: '#EF4444',
                                    color: 'white',
                                    borderRadius: '6px',
                                    fontFamily: font.Medium,
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ContentLayout>
    );
};

export default InterviewEvaluationPage;
