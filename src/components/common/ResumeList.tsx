import { FileText } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import type { ResumeContent } from '../../interface/resumeInterface';

interface ResumeListProps {
    resumes: ResumeContent;
    selectedResumeId: string;
    onResumeSelect: (resumeId: string) => void;
    error?: string;
    isMobile?: boolean;
    isTablet?: boolean;
}

const ResumeList = ({ 
    resumes, 
    selectedResumeId, 
    onResumeSelect, 
    error, 
    isMobile = false, 
    isTablet = false 
}: ResumeListProps) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const existingResumeCardStyle: React.CSSProperties = {
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        borderRadius: Size.Small,
        padding: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: Size.Small,
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
    };

    const existingResumeCardStyleHover: React.CSSProperties = {
        borderColor: Colors.ACCENT_COLOR,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        transform: 'translateX(8px)',
    };

    const existingResumeCardSelectedStyle: React.CSSProperties = {
        borderColor: Colors.ACCENT_COLOR,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        transform: 'translateX(8px)',
    };

    const resumeCardHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Size.Small,
    };

    const resumeCardTitleStyle: React.CSSProperties = {
        fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        display: 'flex',
        alignItems: 'center',
        gap: Size.Small,
        flexWrap: 'wrap',
        wordBreak: 'break-word',
    };

    const resumeCardMetaStyle: React.CSSProperties = {
        fontSize: Size.Small,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        opacity: 0.8,
        wordBreak: 'break-word',
    };

    const tipBoxStyle: React.CSSProperties = {
        padding: Size.Medium,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT + '20',
        borderRadius: Size.Small,
        border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
        textAlign: 'center',
        marginTop: Size.Small,
        marginBottom: Size.Medium,
    };

    const tipTextStyle: React.CSSProperties = {
        fontSize: '12px',
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular,
    };

    const errorStyle: React.CSSProperties = {
        color: Colors.TEXT_ERROR_COLOR,
        fontSize: Size.Small,
        marginTop: Size.Small,
        padding: Size.Small,
        backgroundColor: Colors.TEXT_ERROR_COLOR + '20',
        borderRadius: Size.Small,
        border: `1px solid ${Colors.TEXT_ERROR_COLOR}`,
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Medium,
        height: '100%',
        justifyContent: 'flex-start',
    };

    const listContainerStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Small,
        overflowY: 'auto',
        padding: Size.Small,
        borderRadius: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
    };

    return (
        <div style={containerStyle}>
            <div style={tipBoxStyle}>
                <div style={tipTextStyle}>
                    💡 Tip: Select the resume that best matches the job requirements
                </div>
            </div>
            
            <div style={listContainerStyle}>
                {resumes.resumes.map((resume) => (
                    <div
                        key={resume.id}
                        style={{
                            ...existingResumeCardStyle,
                            ...(selectedResumeId === resume.id ? existingResumeCardSelectedStyle : {}),
                        }}
                        onClick={() => onResumeSelect(resume.id)}
                        onMouseEnter={(e) => {
                            if (selectedResumeId !== resume.id) {
                                e.currentTarget.style.transform = existingResumeCardStyleHover.transform!;
                                e.currentTarget.style.boxShadow = existingResumeCardStyleHover.boxShadow!;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedResumeId !== resume.id) {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                    >
                        <div style={resumeCardHeaderStyle}>
                            <div style={resumeCardTitleStyle}>
                                <FileText size={20} color={Colors.ACCENT_COLOR} />
                                {resume.fileName}
                            </div>
                            {selectedResumeId === resume.id && (
                                <div style={{ color: Colors.ACCENT_COLOR, fontSize: Size.Small }}>
                                    ✓ Selected
                                </div>
                            )}
                        </div>
                        <div style={resumeCardMetaStyle}>
                            Uploaded: {new Date(resume.createdAt).toLocaleDateString()} • 
                            Size: {formatFileSize(resume.byteSize)}
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ResumeList;
