import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import type { InterviewEvaluation } from '../../interface/interviewInterface';
import font from '../../assets/styles/Font';
import { Colors } from '../../assets/styles';

interface AnalyticsTabProps {
    evaluation: InterviewEvaluation;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ evaluation }) => {
    const [showInsights, setShowInsights] = useState<{ [key: string]: boolean }>({});

    const toggleInsights = (category: string) => {
        setShowInsights(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const getScoreColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return '#10B981';
        if (percentage >= 60) return '#F59E0B';
        return '#EF4444';
    };

    const formatTime = (seconds: number) => {
        return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    };

    const rubricItemStyle: CSSProperties = {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '12px',
        border: '1px solid #E5E7EB'
    };

    const categoryItemStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        padding: '4px 0',
        fontSize: '12px',
        gap: '10px',
    };

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
                    Total Duration: {formatTime(evaluation.analytics.total_duration)}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                    You: {formatTime(evaluation.analytics.speaking_time.user)}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                    Interviewer: {formatTime(evaluation.analytics.speaking_time.interviewer)}
                </div>
            </div>

            <div style={{ fontSize: '16px', marginBottom: '16px' }}>
                Score Analysis
            </div>

            {evaluation.feedback.coaching.map((item, index) => (
                <div key={index} style={rubricItemStyle}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                        }}>
                            <div style={{ fontFamily: font.Medium, fontSize: '14px' }}>
                                Greeting Phrase
                            </div>
                            <div style={{ 
                                fontFamily: font.Bold, 
                                fontSize: '14px',
                                color: getScoreColor(item.score, item.max_score)
                            }}>
                                {item.score}/{item.max_score}
                            </div>
                    </div>
                    
                    <div style={categoryItemStyle}>
                        <span style={{ color: Colors.SECONDARY_TEXT_COLOR, fontFamily: font.Medium }}>Clarity:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span
                                    style={{
                                    color: getScoreColor(4, item.max_score),
                                    fontFamily: font.Medium
                                }}>
                                    4/{item.max_score}
                                </span>
                            </div>
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
                        {showInsights[item.category] ? 'Hide insights ↑' : 'Show insights ↓'} 
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
        </div>
    );
};

export default AnalyticsTab;
