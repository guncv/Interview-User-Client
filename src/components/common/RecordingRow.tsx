import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import { ClickableLink } from './';
import type { InterviewSessionSummary } from '../../interface/interviewInterface';
import { safeNavigate } from '../../utils/navigation';
import { useContextProvider } from '../layout/ContextProvider';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface RecordingRowProps {
    interview: InterviewSessionSummary;
    onDownloadResume: (resumeId: string) => void;
}

const RecordingRow: React.FC<RecordingRowProps> = ({ interview, onDownloadResume }) => {
    const [isHovered, setIsHovered] = useState(false);
    const {isTablet, isMobile} = useContextProvider();

    const rowStyle: CSSProperties = {
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        backgroundColor: isHovered ? Colors.CONTENT_HOVER_COLOR : 'transparent',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
    };

    const dataCellStyle: CSSProperties = {
        padding: isMobile ? "8px 10px" : "16px 12px",
        textAlign: 'left',
        borderBottom: `1px solid #e9ecef`,
        fontSize: isMobile ? "11px" : isTablet ? "13px" : Size.Medium,
        color: Colors.PRIMARY_COLOR,
        transition: 'all 0.3s ease',
    };

    const handleRowClick = () => {
        safeNavigate(`/evaluation/${interview.id}`);
    };

    return (
        <tr 
            key={interview.id}
            style={rowStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleRowClick}
        >
            <td style={dataCellStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>{interview.position}</span>
                </div>
            </td>
            
            {isMobile ? null : <td style={{...dataCellStyle, textAlign: 'center'}}>
                <ClickableLink
                    onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                        e.stopPropagation();
                        onDownloadResume(interview.resume_id);
                    }}
                    style={{ fontSize: isTablet ? "10px" : Size.Medium }}
                    hoverColor={Colors.ACCENT_COLOR}
                    underlineOnHover={true}
                    scaleOnHover={true}
                >
                    {interview.resume_file_name}
                </ClickableLink>
            </td>}
            
            <td style={{...dataCellStyle, textAlign: 'center'}}>
                <span style={{ 
                    fontWeight: 'bold',
                    color: `${interview.overall_score_color}`,
                }}>
                    {interview.overall_score}
                </span>
            </td>
            
            <td style={{...dataCellStyle, textAlign: 'center'}}>
                <span style={{
                    padding: isMobile ? "4px 8px" : "4px 12px",
                    borderRadius: '16px',
                    fontSize: isMobile ? "8px" : isTablet ? "10px" : "12px",
                    fontWeight: 'bold',
                    backgroundColor: `${interview.status_color + '20'}`,
                    color: `${interview.status_color}`,
                }}>
                    {interview.status}
                </span>
            </td>
            
            <td style={{...dataCellStyle, textAlign: 'center'}}>
                <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                    {interview.total_time}
                </span>
            </td>
            
            <td style={{...dataCellStyle, textAlign: 'center', fontSize: "12px"}}>
                <span style={{ color: Colors.SECONDARY_TEXT_COLOR }}>
                    {dayjs(interview.created_at).fromNow()}
                </span>
            </td>
        </tr>
    );
};

export default RecordingRow;
