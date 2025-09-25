import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import font from '../../assets/styles/Font';
import { useDispatch, useSelector } from 'react-redux';
import { getPhraseEvaluationsWithCriteriaBySessionID } from '../../actions/evaluationAction';
import type { RootState } from '../../reducers/rootReducer';
import InsiderLoadingSpinner from './InsiderLoadingSpinner';

type AnalyticsTabProps = {
    sessionID: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ sessionID }) => {
    const [showInsights, setShowInsights] = useState<{ [key: string]: boolean }>({});
    const dispatch = useDispatch();

    const { phraseEvaluationsWithCriteriaBySessionID, phraseEvaluationsWithCriteriaBySessionIDLoading, phraseEvaluationsWithCriteriaBySessionIDError } = useSelector((state: RootState) => state.evaluation);

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

    return (
        <div>
            <div style={{ fontSize: '16px', marginBottom: '16px' }}>
                Overall Analysis
            </div>

            <div style={rubricItemStyle}>
                <div style={{ fontFamily: font.Medium, fontSize: '14px', marginBottom: '8px' }}>
                    Performance Metrics
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                    Total Duration: 0.01
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
