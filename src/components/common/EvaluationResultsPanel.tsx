import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import font from '../../assets/styles/Font';
import { Colors } from '../../assets/styles';
import AnalyticsTab from './AnalyticsTab';
import CriteriaTab from './CriteriaTab';
import { useSelector } from 'react-redux';
import type { RootState } from '../../reducers/rootReducer';

type EvaluationResultsPanelProps = {
    sessionID: string;
}

const EvaluationResultsPanel: React.FC<EvaluationResultsPanelProps> = ({
    sessionID
}) => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'details' | 'criteria'>('analytics');
    const [showOverallFeedbackModal, setShowOverallFeedbackModal] = useState<boolean>(false);
    const interviewSessionInformationById = useSelector((state: RootState) => state.interview.interviewSessionInformationById);


    const truncateTextToLines = (text: string, maxLines: number = 2) => {
        const words = text.split(' ');
        const wordsPerLine = 8;
        const maxWords = maxLines * wordsPerLine;
        
        if (words.length <= maxWords) {
            return { text, isTruncated: false };
        }
        
        return {
            text: words.slice(0, maxWords).join(' ') + '...',
            isTruncated: true
        };
    };

    const rightSidebarStyle: CSSProperties = {
        width: '400px',
        backgroundColor: 'white',
        borderLeft: '1px solid #E5E7EB',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
    };

    const tabStyle: CSSProperties = {
        padding: '12px 16px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderBottom: '0px solid transparent',
        fontFamily: font.Medium,
        fontSize: '14px',
    };

    const activeTabStyle: CSSProperties = {
        ...tabStyle,
        borderBottom: '2px solid ' + Colors.ACCENT_COLOR,
        color: Colors.ACCENT_COLOR
    };

    const scoreCardStyle: CSSProperties = {
        backgroundColor: '#F3F4F6',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        flexShrink: 0
    };

    const tabContentStyle: CSSProperties = {
        flex: 1,
        overflowY: 'auto',
        paddingRight: '8px'
    };

    return (
        <div style={rightSidebarStyle}>
            <div style={scoreCardStyle}>
                <div style={{ 
                    fontFamily: font.Medium,
                    fontSize: '16px',
                    marginBottom: '8px',
                    color: '#1F2937'
                }}>
                    Session Status: <span style={{ color: interviewSessionInformationById.status_color }}>{interviewSessionInformationById.status_display_name}</span>
                </div>
                <div style={{ 
                    fontFamily: font.Medium,
                    fontSize: '14px',
                    marginBottom: '12px',
                    color: `${interviewSessionInformationById.overall_score_color}`
                }}>
                    <span style={{color:'#6B7280'}}>Your score was </span> {interviewSessionInformationById.overall_score_percent}
                </div>

                <div style={{ marginTop: '8px' }}>
                    <div style={{
                        fontSize: '12px',
                        color:'#6B7280',
                        lineHeight: '1.4'
                    }}>
                        Overall feedback: {showOverallFeedbackModal
                            ? interviewSessionInformationById.summary_md
                            : truncateTextToLines(interviewSessionInformationById.summary_md).text
                        }
                    </div>
                    
                    {truncateTextToLines(interviewSessionInformationById.summary_md).isTruncated && (
                        <button 
                            onClick={() => setShowOverallFeedbackModal(!showOverallFeedbackModal)}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: Colors.ACCENT_COLOR, 
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontFamily: font.Medium,
                                marginTop: '4px',
                                padding: '0'
                            }}
                        >
                            {showOverallFeedbackModal ? 'Show Less ↑' : 'Show More ↓'}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '16px', flexShrink: 0 }}>
                <button
                    onClick={() => setActiveTab('analytics')}
                    style={activeTab === 'analytics' ? activeTabStyle : tabStyle}
                >
                    Analytics
                </button>

                <button
                    onClick={() => setActiveTab('details')}
                    style={activeTab === 'details' ? activeTabStyle : tabStyle}
                >
                    Details
                </button>
                
                <button
                    onClick={() => setActiveTab('criteria')}
                    style={activeTab === 'criteria' ? activeTabStyle : tabStyle}
                >
                    Criteria
                </button>
            </div>

            <div style={tabContentStyle}>
                {activeTab === 'analytics' && <AnalyticsTab sessionID={sessionID}/>}
                {/* {activeTab === 'details' && <InfoTab evaluation={evaluation} />} */}
                {activeTab === 'criteria' && <CriteriaTab />}
            </div>
        </div>
    );
};

export default EvaluationResultsPanel;
