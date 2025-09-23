import React from 'react';
import font from '../../assets/styles/Font';
import { Colors } from '../../assets/styles';
import type { InterviewEvaluation } from '../../interface/interviewInterface';
import { formatDuration, formatDate } from '../../utils/format';

interface InfoTabProps {
    evaluation: InterviewEvaluation;
}

const InfoTab: React.FC<InfoTabProps> = ({ evaluation }) => {
    const infoItems = [
        {
            label: 'Position Applied For',
            value: evaluation.session_id || 'N/A',
            icon: '💼'
        },
        {
            label: 'Interview Duration',
            value: formatDuration(evaluation.analytics.total_duration),
            icon: '⏱️'
        },
        {
            label: 'Overall Score',
            value: `${evaluation.overall_score}%`,
            icon: '📊'
        },
        {
            label: 'Status',
            value: evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1),
            icon: '📋'
        },
        {
            label: 'Created Date',
            value: formatDate(evaluation.created_at),
            icon: '📅'
        },
        {
            label: 'Speaking Time (User)',
            value: formatDuration(evaluation.analytics.speaking_time.user),
            icon: '🎤'
        },
        {
            label: 'Speaking Time (Interviewer)',
            value: formatDuration(evaluation.analytics.speaking_time.interviewer),
            icon: '🤖'
        },
        {
            label: 'Confidence Score',
            value: `${evaluation.analytics.confidence_score}%`,
            icon: '💪'
        },
        {
            label: 'Clarity Score',
            value: `${evaluation.analytics.clarity_score}%`,
            icon: '🎯'
        },
        {
            label: 'Average Response Time',
            value: evaluation.analytics.response_times.length > 0 
                ? `${Math.round(evaluation.analytics.response_times.reduce((a, b) => a + b, 0) / evaluation.analytics.response_times.length)}s`
                : 'N/A',
            icon: '⚡'
        },
        {
            label: 'Keywords Used',
            value: evaluation.analytics.keywords_used.length > 0 
                ? evaluation.analytics.keywords_used.slice(0, 5).join(', ') + (evaluation.analytics.keywords_used.length > 5 ? '...' : '')
                : 'None',
            icon: '🔑'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return '#10B981';
            case 'processing':
                return '#F59E0B';
            case 'failed':
                return '#EF4444';
            default:
                return Colors.SECONDARY_TEXT_COLOR;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10B981';
        if (score >= 60) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div style={{ 
            backgroundColor: Colors.BACKGROUND_COLOR,
            borderRadius: '8px',
            fontFamily: font.Regular
        }}>
            <div style={{ 
                fontSize: '16px', 
                marginBottom: '16px',
                color: Colors.PRIMARY_COLOR,
                fontFamily: font.Medium
            }}>
                Interview Information
            </div>
            
            <div style={{ 
                fontSize: '12px', 
                marginBottom: '20px',
                color: Colors.SECONDARY_TEXT_COLOR,
                lineHeight: '1.5'
            }}>
                Comprehensive details about your interview session, including performance metrics and session metadata.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {infoItems.map((item, index) => (
                    <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: Colors.LECTURE_CONTENT_PART_COLOR,
                        borderRadius: '6px',
                        border: `1px solid ${Colors.BORDER_COLOR}`
                    }}>
                        <div style={{ flex: 1, }}>
                            <div style={{ 
                                fontSize: '12px', 
                                marginBottom: '2px',
                                color: Colors.SECONDARY_TEXT_COLOR,
                                fontFamily: font.Regular
                            }}>
                                {item.label}
                            </div>

                            <div style={{ 
                                fontSize: '13px',
                                color: Colors.PRIMARY_COLOR,
                                fontFamily: font.Medium,
                                wordBreak: 'break-word'
                            }}>
                                {item.label === 'Status' ? (
                                    <span style={{ color: getStatusColor(item.value) }}>
                                        {item.value}
                                    </span>
                                ) : item.label === 'Overall Score' || item.label === 'Confidence Score' || item.label === 'Clarity Score' ? (
                                    <span style={{ color: getScoreColor(parseInt(item.value)) }}>
                                        {item.value}
                                    </span>
                                ) : (
                                    item.value
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoTab;
