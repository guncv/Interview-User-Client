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
    resumeCount: number;
}

const ResumeList = ({ 
    resumes, 
    selectedResumeId, 
    onResumeSelect, 
    error, 
    isMobile = false, 
    isTablet = false,
    resumeCount
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
        overflow: 'hidden',
    };

    const listContainerStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Small,
        padding: Size.Small,
        borderRadius: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        maxHeight: '300px',
        overflowY: 'auto',
        minHeight: '100px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${Colors.ACCENT_COLOR} transparent`,
    };

    return (
        <div style={containerStyle}>
            <style>
                {`
                    .resume-list-scroll::-webkit-scrollbar {
                        width: 6px;
                    }
                    .resume-list-scroll::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 3px;
                    }
                    .resume-list-scroll::-webkit-scrollbar-thumb {
                        background: ${Colors.ACCENT_COLOR};
                        border-radius: 3px;
                    }
                    .resume-list-scroll::-webkit-scrollbar-thumb:hover {
                        background: ${Colors.ACCENT_COLOR}CC;
                    }
                `}
            </style>
            {resumeCount > 0 && (
                <>
                    <div style={{ fontSize: Size.Medium, fontFamily: font.Medium, color: Colors.PRIMARY_COLOR }}>
                        Default Resume
                    </div>
                    <div
                        key={resumes.default_resume.id}
                        style={{
                            ...existingResumeCardStyle,
                            ...(selectedResumeId === resumes.default_resume.id ? existingResumeCardSelectedStyle : {}),
                        }}
                        onClick={() => onResumeSelect(resumes.default_resume.id)}
                        onMouseEnter={(e) => {
                            if (selectedResumeId !== resumes.default_resume.id) {
                            e.currentTarget.style.transform = existingResumeCardStyleHover.transform!;
                            e.currentTarget.style.boxShadow = existingResumeCardStyleHover.boxShadow!;
                        }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedResumeId !== resumes.default_resume.id) {
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                <div style={resumeCardHeaderStyle}>
                                    <div style={resumeCardTitleStyle}>
                                        <FileText size={20} color={Colors.ACCENT_COLOR} />
                                        {resumes.default_resume.file_name}
                                    </div>
                                    {selectedResumeId === resumes.default_resume.id && (
                                        <div style={{ color: Colors.ACCENT_COLOR, fontSize: Size.Small }}>
                                            ✓ Selected
                                        </div>
                                    )}
                                </div>
                                <div style={resumeCardMetaStyle}>
                                    Uploaded: {new Date(resumes.default_resume.created_at).toLocaleDateString()} • 
                                    Size: {formatFileSize(resumes.default_resume.byte_size)}
                                </div>
                            </div>
                </>
            )}

            {resumes.resumes.length > 0 && (
            <>
                <div style={{ fontSize: Size.Medium, fontFamily: font.Medium, color: Colors.PRIMARY_COLOR }}>
                    Other Resumes
                </div>
            
            <div style={listContainerStyle} className="resume-list-scroll">
                {resumes.resumes.map((resume) => (
                    <div>
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
                                    {resume.file_name}
                                </div>
                                {selectedResumeId === resume.id && (
                                    <div style={{ color: Colors.ACCENT_COLOR, fontSize: Size.Small }}>
                                        ✓ Selected
                                    </div>
                                )}
                            </div>
                            <div style={resumeCardMetaStyle}>
                                Uploaded: {new Date(resume.created_at).toLocaleDateString()} • 
                                Size: {formatFileSize(resume.byte_size)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
            )}
            

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ResumeList;
