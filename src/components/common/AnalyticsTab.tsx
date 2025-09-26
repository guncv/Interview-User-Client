import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import font from '../../assets/styles/Font';
import { Colors } from '../../assets/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getPhraseEvaluationsWithCriteriaBySessionID } from '../../actions/evaluationAction';
import type { RootState } from '../../reducers/rootReducer';
import InsiderLoadingSpinner from './InsiderLoadingSpinner';
import { downloadResumeByResumeId } from '../../actions/resumeAction';

type AnalyticsTabProps = {
    sessionID: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ sessionID }) => {
    const [showInsights, setShowInsights] = useState<{ [key: string]: boolean }>({});
    const dispatch = useDispatch();

    const { phraseEvaluationsWithCriteriaBySessionID, phraseEvaluationsWithCriteriaBySessionIDLoading, phraseEvaluationsWithCriteriaBySessionIDError } = useSelector((state: RootState) => state.evaluation);
    const interviewSessionInformationById = useSelector((state: RootState) => state.interview.interviewSessionInformationById);

    useEffect(() => {
        dispatch(getPhraseEvaluationsWithCriteriaBySessionID(sessionID));
    }, [dispatch]);
    

    const toggleInsights = (category: string) => {
        setShowInsights(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const rubricItemStyle: CSSProperties = {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '12px',
        border: '1px solid #E5E7EB'
    };


    if (phraseEvaluationsWithCriteriaBySessionIDLoading) {
        return <InsiderLoadingSpinner 
        isVisible={phraseEvaluationsWithCriteriaBySessionIDLoading} 
        wrapperStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }} 
        />;
    }

    if (phraseEvaluationsWithCriteriaBySessionIDError) {
        return <div>Error: {phraseEvaluationsWithCriteriaBySessionIDError}</div>;
    }

    const infoItems = [
        {
            label: 'Position Applied For',
            value: interviewSessionInformationById?.position || 'N/A',
        },
        {
            label: 'Interview Duration',
            value: interviewSessionInformationById?.total_time || 'N/A',
        },
        {
            label: 'Overall Score',
            value: `${interviewSessionInformationById?.overall_score}/5`,
        },
        {
            label: 'Status',
            value: interviewSessionInformationById?.status_display_name || 'N/A',
        },
        {
            label: 'Created Date',
            value: interviewSessionInformationById?.created_at || 'N/A',
        },
        {
            label: 'Ended At',
            value: interviewSessionInformationById?.ended_at || 'N/A',
        }
    ];

    return (
        <div>
            <div style={{ 
                fontSize: '16px', 
                marginBottom: '16px',
                color: Colors.PRIMARY_COLOR,
            }}>
                Interview Information
            </div>

            <div style={{ 
                backgroundColor: Colors.BACKGROUND_COLOR,
                border: `1px solid ${Colors.BORDER_COLOR}`,
                borderRadius: '8px',
                fontFamily: font.Regular,
                marginBottom: '15px',
                padding: '16px',
            }}>
                <div style={{ 
                    fontSize: '12px', 
                    marginBottom: '15px',
                    color: Colors.PRIMARY_COLOR,
                    lineHeight: '1.5'
                }}>
                    Comprehensive details about your interview session, including performance metrics and session metadata.
                </div>
                
                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px' 
                }}>

                    <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: Colors.PRIMARY_COLOR,
                        gap: '12px',
                        borderRadius: '6px',
                    }}>
                        <div style={{ 
                            fontSize: '12px', 
                            marginBottom: '2px',
                        }}>
                            Resume
                        </div>

                        <div style={{ 
                            fontSize: '12px',
                            wordBreak: 'break-word',
                            color: Colors.LINK_COLOR,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }} onClick={() => {
                            dispatch(downloadResumeByResumeId(interviewSessionInformationById?.resume_id || ''));
                        }}>
                            {interviewSessionInformationById?.resume_file_name}
                        </div>
                    </div>

                    {infoItems.map((item, index) => (
                        <div key={index} style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: Colors.PRIMARY_COLOR,
                            gap: '12px',
                            borderRadius: '6px',
                        }}>
                            <div style={{ 
                                fontSize: '12px', 
                                marginBottom: '2px',
                            }}>
                                {item.label}
                            </div>

                            <div style={{ 
                                fontSize: '12px',
                                wordBreak: 'break-word',
                                color: item.label === 'Status' 
                                    ? interviewSessionInformationById?.status_color || Colors.SECONDARY_TEXT_COLOR
                                    : item.label === 'Overall Score'
                                    ? interviewSessionInformationById?.overall_score_color || Colors.SECONDARY_TEXT_COLOR
                                    : Colors.PRIMARY_COLOR,
                                backgroundColor: item.label === 'Status'
                                    ? `${interviewSessionInformationById?.status_color} + 20` || "" : ""
                            }}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>

            <div style={{ fontSize: '16px', marginBottom: '16px' }}>
                Score Analysis
            </div>

            {phraseEvaluationsWithCriteriaBySessionID.phrase_evaluations.map((item, index) => (
                <div key={index} style={rubricItemStyle}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                        }}>
                            <div style={{ fontFamily: font.Medium, fontSize: '14px' }}>
                                {item.state_name} Phrase
                            </div>
                            <div style={{ 
                                fontFamily: font.Bold, 
                                fontSize: '14px',
                                color: item.overall_color
                            }}>
                                {item.overall_score}/{item.max_score}
                            </div>
                    </div>

                    {item.criteria && (
                        <div style={{ marginBottom: '8px' }}>
                            {item.criteria.map((sub, subIndex) => (
                                <div key={subIndex} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    fontSize: '12px',
                                    marginBottom: '4px'
                                }}>
                                    <span style={{ color: '#6B7280' }}>{sub.criteria_name}:</span>
                                    <span style={{ 
                                        color: sub.criteria_color,
                                        fontFamily: font.Medium
                                    }}>
                                        {sub.criteria_score}/{sub.max_score}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button 
                        onClick={() => toggleInsights(item.state_name)}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#8B5CF6', 
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily: font.Medium
                        }}
                    >
                        {showInsights[item.state_name] ? 'Hide insights ↑' : 'Show insights ↓'} 
                    </button>

                    {showInsights[item.state_name] && (
                        <div style={{ 
                            marginTop: '8px', 
                            padding: '8px', 
                            backgroundColor: '#F9FAFB',
                            borderRadius: '4px'
                        }}>
                            {item.criteria.map((insight, insightIndex) => (
                                <div key={insightIndex} style={{ 
                                    fontSize: '12px', 
                                    marginBottom: '4px',
                                    color: '#374151'
                                }}>
                                    • {insight.criteria_comment}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AnalyticsTab;
