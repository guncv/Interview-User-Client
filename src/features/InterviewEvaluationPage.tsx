import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import font from '../assets/styles/Font';
import type { CSSProperties } from 'react';
import ContentLayout from '../components/layout/ContentLayout';
import FeedBack from '../components/common/FeedBack';
import ChatContainer from '../components/common/ChatContainer';
import ConfirmationModal from '../components/common/ConfirmationModal';
import EvaluationResultsPanel from '../components/common/EvaluationResultsPanel';
import { Trash } from 'lucide-react';
import { Colors } from '../assets/styles';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../reducers/rootReducer';
import { createReviewComment } from '../actions/reviewCommenAction';
import { deleteInterviewSessionByIdAction, getInterviewSessionInformationById } from '../actions/interviewAction';
import { useContextProvider } from '../components/layout/ContextProvider';

const InterviewEvaluationPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const dispatch = useDispatch();
    const { isTablet, isSpecialMobile, isMobile } = useContextProvider();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'analytics' | 'details' | 'criteria'>('chat');

    const alreadyFeedback = useSelector((state: RootState) => state.reviewComment.alreadyFeedback);
    const feedBackError = useSelector((state: RootState) => state.reviewComment.error);
    const interviewSessionInformationById = useSelector((state: RootState) => state.interview.interviewSessionInformationById);
    
    useEffect(() => {
        dispatch(getInterviewSessionInformationById(sessionId || ''));
    }, [sessionId, dispatch]);

    const handleSubmitClick = (rating: number, comment: string | null) => {
        dispatch(createReviewComment({
            session_id: sessionId || '',
            rating,
            comment
        }));
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
        height: '100%',
        overflow: 'hidden'
    };

    const mainContentStyle: CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: isSpecialMobile ? '100vw' : isTablet ? 'calc(100vw - 400px)' : 'calc(100vw - 600px)',
        overflow: 'hidden',
        height: '100%'
    };


    const headerStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: isMobile ? '15px 20px' : '20px 40px'
    };

    const feedbackContainerStyle: CSSProperties = {
        flex: 1,
        padding: isSpecialMobile ? '16px' : '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'hidden',
        minHeight: 0
    };

    const mobileTabContainerStyle: CSSProperties = {
        display: 'flex',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: '10px',
        alignItems: 'center',
        padding: '0 16px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    };

    const mobileTabStyle: CSSProperties = {
        padding: '12px 16px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontFamily: font.Medium,
        fontSize: '14px',
        color: '#6B7280',
        whiteSpace: 'nowrap',
        borderBottom: '2px solid transparent',
        transition: 'all 0.2s ease',
        minWidth: '80px',
        textAlign: 'center',
    };

    const activeMobileTabStyle: CSSProperties = {
        ...mobileTabStyle,
        borderBottom: '2px solid ' + Colors.ACCENT_COLOR,
        color: Colors.ACCENT_COLOR,
    };

    const mobileTabContentStyle: CSSProperties = {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    };

    const renderMobileTabContent = () => {
        switch (activeMobileTab) {
            case 'chat':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                        <FeedBack
                            onSubmitClick={handleSubmitClick}
                            alreadyFeedback={alreadyFeedback}
                            FeedBackError={feedBackError}
                        />
                        <ChatContainer
                            showFeedback={true}
                            session_id={sessionId || ''}
                        />
                    </div>
                );
            case 'analytics':
                return <EvaluationResultsPanel sessionID={sessionId || ''} activeTab="analytics" />;
            case 'criteria':
                return <EvaluationResultsPanel sessionID={sessionId || ''} activeTab="criteria" />;
            default:
                return null;
        }
    };

    return (
        <ContentLayout>
            <div style={containerStyle}>
                <div style={mainContentStyle}>
                    <div style={headerStyle}>
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontFamily: font.Regular, 
                                fontSize: isSpecialMobile ? '20px' : '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                General Interview
                            </h1>
                            <p style={{ 
                                margin: '4px 0 0 0', 
                                color: '#6B7280', 
                                fontSize: isSpecialMobile ? '12px' : '14px' 
                            }}>
                                {interviewSessionInformationById.created_at_full_name}
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

                    {isSpecialMobile ? (
                        <>
                            <div style={mobileTabContainerStyle}>
                                <button
                                    onClick={() => setActiveMobileTab('chat')}
                                    style={activeMobileTab === 'chat' ? activeMobileTabStyle : mobileTabStyle}
                                >
                                    Chat
                                </button>
                                <button
                                    onClick={() => setActiveMobileTab('analytics')}
                                    style={activeMobileTab === 'analytics' ? activeMobileTabStyle : mobileTabStyle}
                                >
                                    Analytics
                                </button>
                                <button
                                    onClick={() => setActiveMobileTab('criteria')}
                                    style={activeMobileTab === 'criteria' ? activeMobileTabStyle : mobileTabStyle}
                                >
                                    Criteria
                                </button>
                            </div>
                            <div style={mobileTabContentStyle}>
                                {renderMobileTabContent()}
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={feedbackContainerStyle}>
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                                    <FeedBack
                                        onSubmitClick={handleSubmitClick}
                                        alreadyFeedback={alreadyFeedback}
                                        FeedBackError={feedBackError}
                                    />
                                    <ChatContainer
                                        showFeedback={true}
                                        session_id={sessionId || ''}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {!isSpecialMobile && <EvaluationResultsPanel sessionID={sessionId || ''}/>}
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                title="Delete Interview Session"
                message="Are you sure you want to delete this interview session? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonColor={Colors.TEXT_ERROR_COLOR}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </ContentLayout>
    );
};

export default InterviewEvaluationPage;
