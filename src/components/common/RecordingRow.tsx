import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import { ClickableLink } from './';

interface Interview {
    id: number;
    position: string;
    resume_id: string;
    resume_file_name: string;
    score: string;
    totalTime: string;
    status: string;
    createdAt: string;
}

interface RecordingRowProps {
    interview: Interview;
    onDownloadResume: (resumeId: string) => void;
}

const RecordingRow: React.FC<RecordingRowProps> = ({ interview, onDownloadResume }) => {
    const [isHovered, setIsHovered] = useState(false);

    const rowStyle: CSSProperties = {
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        backgroundColor: isHovered ? Colors.CONTENT_HOVER_COLOR : 'transparent',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
    };

    const dataCellStyle: CSSProperties = {
        padding: '16px 12px',
        textAlign: 'left',
        borderBottom: `1px solid #e9ecef`,
        fontSize: Size.Medium,
        color: Colors.PRIMARY_COLOR,
        transition: 'all 0.3s ease',
    };

    const handleRowClick = () => {
        console.log('Row clicked:', interview.id);
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
            
            <td style={{...dataCellStyle, textAlign: 'center'}}>
                <ClickableLink
                    onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                        e.stopPropagation();
                        onDownloadResume(interview.resume_id);
                    }}
                    style={{ fontSize: Size.Medium }}
                    hoverColor={Colors.ACCENT_COLOR}
                    underlineOnHover={true}
                    scaleOnHover={true}
                >
                    {interview.resume_file_name}
                </ClickableLink>
            </td>
            
            <td style={{...dataCellStyle, textAlign: 'center'}}>
                <span style={{ 
                    fontWeight: 'bold',
                    color: parseInt(interview.score) >= 80 ? Colors.SUCCESS_COLOR :
                        parseInt(interview.score) >= 60 ? Colors.WARNING_COLOR :
                        Colors.TEXT_ERROR_COLOR
                }}>
                    {interview.score}
                </span>
            </td>
            
            <td style={{...dataCellStyle, textAlign: 'center'}}>
                <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: interview.status === 'Completed' ? Colors.GREEN_COLOR_LIGHT : Colors.BORDER_COLOR,
                    color: interview.status === 'Completed' ? Colors.GREEN_COLOR : Colors.SECONDARY_TEXT_COLOR,
                }}>
                    {interview.status}
                </span>
            </td>
            
            <td style={{...dataCellStyle, textAlign: 'center'}}>
                <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                    {interview.totalTime}
                </span>
            </td>
            
            <td style={{...dataCellStyle, textAlign: 'center'}}>
                <span style={{ color: Colors.SECONDARY_TEXT_COLOR }}>
                    {interview.createdAt}
                </span>
            </td>
        </tr>
    );
};

export default RecordingRow;
