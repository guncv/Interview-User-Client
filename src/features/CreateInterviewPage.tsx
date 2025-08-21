import { useState, useRef, type CSSProperties } from 'react';
import { Upload, FileText, Plus, X } from 'lucide-react';
import ContentLayout from "../components/layout/ContentLayout";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { PrimaryTextField } from "../components/common/PrimaryTextField";
import { PrimaryDropdown } from "../components/common/PrimaryDropdown";
import Colors from "../assets/styles/Color";
import Size from "../assets/styles/Size";
import font from "../assets/styles/Font";
import { useContextProvider } from "../components/layout/ContextProvider";
import type { 
    CreateInterviewSessionWithNewResumeRequest,
    CreateInterviewSessionWithExistingResumeRequest,
    CreateInterviewFormErrors,
    Resume
} from "../interface/interviewInterface";

const CreateInterviewPage = () => {
    const { isMobile } = useContextProvider();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [resumeMode, setResumeMode] = useState<'upload' | 'existing'>('upload');
    const [formData, setFormData] = useState({
        file: null as File | null,
        resumeId: '',
        position: '',
        company: '',
        workType: '',
        jobRequirements: '',
        interviewType: '',
        language: '',
        consentAt: new Date(),
        consentGiven: false,
    });
    
    const [errors, setErrors] = useState<CreateInterviewFormErrors>({});
    
    const [existingResumes] = useState<Resume[]>([
        { id: '1', fileName: 'Software_Engineer_Resume.pdf', uploadDate: '2024-01-15', fileSize: 245760 },
        { id: '2', fileName: 'Product_Manager_Resume.pdf', uploadDate: '2024-01-10', fileSize: 198432 },
        { id: '3', fileName: 'Data_Scientist_Resume.pdf', uploadDate: '2024-01-05', fileSize: 312456 },
    ]);

    const workTypeOptions = [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'internship', label: 'Internship' },
        { value: 'freelance', label: 'Freelance' },
    ];

    const interviewTypeOptions = [
        { value: 'technical', label: 'Technical Interview' },
        { value: 'behavioral', label: 'Behavioral Interview' },
        { value: 'case-study', label: 'Case Study Interview' },
        { value: 'system-design', label: 'System Design Interview' },
        { value: 'general', label: 'General Interview' },
    ];

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'zh', label: 'Chinese' },
        { value: 'ja', label: 'Japanese' },
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, file }));
            setErrors(prev => ({ ...prev, file: undefined }));
        }
    };

    const handleInputChange = (field: string, value: string | Date) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleConsentChange = (checked: boolean) => {
        setFormData(prev => ({ 
            ...prev, 
            consentGiven: checked,
            consentAt: checked ? new Date() : new Date(0) // Set consent date when given
        }));
        setErrors(prev => ({ ...prev, consentGiven: undefined }));
    };

    const validateForm = (): boolean => {
        const newErrors: CreateInterviewFormErrors = {};

        if (resumeMode === 'upload' && !formData.file) {
            newErrors.file = 'Please select a resume file';
        }

        if (resumeMode === 'existing' && !formData.resumeId) {
            newErrors.resumeId = 'Please select an existing resume';
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
        }

        if (!formData.company.trim()) {
            newErrors.company = 'Company is required';
        }

        if (!formData.workType) {
            newErrors.workType = 'Work type is required';
        }

        if (!formData.jobRequirements.trim()) {
            newErrors.jobRequirements = 'Job requirements are required';
        }

        if (!formData.interviewType) {
            newErrors.interviewType = 'Interview type is required';
        }

        if (!formData.language) {
            newErrors.language = 'Language is required';
        }

        if (!formData.consentAt) {
            newErrors.consentAt = 'Consent date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (resumeMode === 'upload') {
                const request: CreateInterviewSessionWithNewResumeRequest = {
                    file: formData.file!,
                    position: formData.position,
                    company: formData.company,
                    workType: formData.workType,
                    jobRequirements: formData.jobRequirements,
                    interviewType: formData.interviewType,
                    language: formData.language,
                    consentAt: formData.consentAt,
                    consentGiven: formData.consentGiven,
                };
                console.log('Creating interview with new resume:', request);
                // TODO: Call API
            } else {
                const request: CreateInterviewSessionWithExistingResumeRequest = {
                    resumeId: formData.resumeId,
                    position: formData.position,
                    company: formData.company,
                    workType: formData.workType,
                    jobRequirements: formData.jobRequirements,
                    interviewType: formData.interviewType,
                    language: formData.language,
                    consentAt: formData.consentAt,
                    consentGiven: formData.consentGiven,
                };
                console.log('Creating interview with existing resume:', request);
                // TODO: Call API
            }
        } catch (error) {
            console.error('Error creating interview session:', error);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const pageContainerStyle: CSSProperties = {
        padding: isMobile ? Size.Small : Size.Large,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? Size.Small : Size.Medium,
        overflow: 'auto',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
    };

    const headerStyle: CSSProperties = {
        textAlign: 'left',
        marginBottom: isMobile ? Size.Small : Size.Medium,
    };

    const titleStyle: CSSProperties = {
        fontSize: isMobile ? Size.Medium : Size.Large,
        fontFamily: font.Regular,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Small,
        background: `linear-gradient(135deg, ${Colors.PRIMARY_COLOR} 0%, ${Colors.ACCENT_COLOR} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        wordWrap: 'break-word',
    };

    const subtitleStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        lineHeight: '1.6',
        wordWrap: 'break-word',
    };

    const mainContentStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? Size.Medium : Size.Large,
        marginBottom: isMobile ? Size.Medium : Size.Large,
        alignItems: 'start',
        width: '100%',
        ...(isMobile && {
            gridTemplateRows: 'auto auto',
            gridTemplateAreas: '"left" "right"',
        }),
    };

    const leftSideStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? Size.Small : Size.Medium,
        minHeight: 'fit-content',
        alignItems: 'center',
        width: '100%',
        ...(isMobile && {
            gridArea: 'left',
            marginBottom: Size.Medium,
        }),
    };

    const rightSideStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? Size.Medium : Size.Large,
        width: '100%',
        ...(isMobile && {
            gridArea: 'right',
        }),
    };

    const resumeModeToggleStyle: CSSProperties = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? Size.Small : Size.Small,
        marginBottom: Size.Small,
        background: `linear-gradient(135deg, ${Colors.TEXT_WHITE_COLOR} 0%, ${Colors.LECTURE_CONTENT_PART_COLOR} 100%)`,
        borderRadius: Size.Small,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        width: '100%',
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Regular,
    };

    const modeButtonStyle: CSSProperties = {
        flex: 1,
        padding: isMobile ? Size.Small : Size.Medium,
        border: 'none',
        borderRadius: Size.Small,
        fontFamily: font.Medium,
        fontSize: isMobile ? Size.Small : Size.Medium,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        minHeight: isMobile ? '44px' : 'auto',
    };

    const activeModeButtonStyle: CSSProperties = {
        ...modeButtonStyle,
        background: `linear-gradient(135deg, ${Colors.ACCENT_COLOR} 0%, ${Colors.ACCENT_COLOR_LIGHT} 100%)`,
        color: Colors.TEXT_WHITE_COLOR,
        boxShadow: '0 4px 15px rgba(139, 21, 255, 0.3)',
        transform: 'translateY(-2px)',
    };

    const inactiveModeButtonStyle: CSSProperties = {
        ...modeButtonStyle,
        background: 'transparent',
        color: Colors.SECONDARY_TEXT_COLOR,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
    };

    const formSectionLeftStyle: CSSProperties = {
        borderRadius: Size.Small,
        padding: isMobile ? Size.Medium : Size.Large,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        height: isMobile ? 'auto' : '500px',
        minHeight: isMobile ? '400px' : '500px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: isMobile ? '100%' : '500px',
        ...(isMobile && {
            marginBottom: Size.Medium,
        }),
    };

    const formSectionRightStyle: CSSProperties = {
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        borderRadius: Size.Small,
        padding: isMobile ? Size.Medium : Size.Large,
        minHeight: isMobile ? 'auto' : '600px',
        maxHeight: isMobile ? 'none' : '600px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: isMobile ? '100%' : '500px',
    };

    const formSectionStyleHover: CSSProperties = {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    };

    const sectionTitleStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Regular,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Medium,
        display: 'flex',
        width: '100%',
        maxWidth: isMobile ? '100%' : '600px',
        alignItems: 'start',
        gap: Size.Small,
        paddingBottom: Size.Small,
        borderBottom: `2px solid ${Colors.ACCENT_COLOR_LIGHT}`,
        flexWrap: 'wrap',
    };

    const fileUploadAreaStyle: CSSProperties = {
        border: `2px dashed ${Colors.ACCENT_COLOR}`,
        borderRadius: Size.Small,
        padding: isMobile ? Size.Medium : Size.Large,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: `linear-gradient(135deg, ${Colors.ACCENT_COLOR_LIGHT} 0%, ${Colors.TEXT_WHITE_COLOR} 100%)`,
        height: isMobile ? '200px' : '250px',
        display: 'flex',
        width: '100%',
        maxWidth: isMobile ? '100%' : '400px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        flex: 'none',
    };

    const fileUploadIconStyle: CSSProperties = {
        width: isMobile ? '35px' : '45px',
        height: isMobile ? '30px' : '40px',
        color: Colors.ACCENT_COLOR,
        margin: '0 auto',
        marginBottom: Size.Medium,
        transition: 'all 0.3s ease',
    };

    const fileUploadTextStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Small,
        textAlign: 'center',
        padding: isMobile ? '0 10px' : '0',
    };

    const fileUploadSubtextStyle: CSSProperties = {
        fontSize: Size.Small,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        opacity: 0.8,
        textAlign: 'center',
        padding: isMobile ? '0 10px' : '0',
    };

    const selectedFileStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        padding: isMobile ? Size.Small : Size.Small,
        borderRadius: Size.Small,
        border: `2px solid ${Colors.ACCENT_COLOR}`,
        marginTop: Size.Medium,
        boxShadow: '0 4px 15px rgba(139, 21, 255, 0.1)',
        transition: 'all 0.3s ease',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: isMobile ? Size.Small : Size.Small,
    };

    const fileInfoStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: Size.Small,
        fontSize: Size.Small,
        flexWrap: 'wrap',
        wordBreak: 'break-word',
        flex: 1,
    };

    const removeFileButtonStyle: CSSProperties = {
        backgroundColor: Colors.TEXT_ERROR_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        border: 'none',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
    };

    const existingResumeCardStyle: CSSProperties = {
        border: `2px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        borderRadius: Size.Small,
        padding: isMobile ? Size.Small : Size.Medium,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: Size.Small,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        position: 'relative',
        overflow: 'hidden',
        height: isMobile ? 'auto' : '120px',
        minHeight: isMobile ? '100px' : '120px',
        width: '100%',
    };

    const existingResumeCardStyleHover: CSSProperties = {
        borderColor: Colors.ACCENT_COLOR,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        transform: 'translateX(8px)',
        boxShadow: '0 6px 20px rgba(139, 21, 255, 0.15)',
    };

    const existingResumeCardSelectedStyle: CSSProperties = {
        borderColor: Colors.ACCENT_COLOR,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        boxShadow: '0 6px 20px rgba(139, 21, 255, 0.2)',
        transform: 'translateX(8px)',
    };

    const resumeCardHeaderStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Size.Small,
    };

    const resumeCardTitleStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        display: 'flex',
        alignItems: 'center',
        gap: Size.Small,
        flexWrap: 'wrap',
        wordBreak: 'break-word',
    };

    const resumeCardMetaStyle: CSSProperties = {
        fontSize: Size.Small,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        opacity: 0.8,
        wordBreak: 'break-word',
    };

    const formGridStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? Size.Small : Size.Medium,
        marginBottom: isMobile ? Size.Small : Size.Medium,
    };

    const submitButtonStyle: CSSProperties = {
        marginTop: isMobile ? Size.Medium : Size.Large,
        padding: isMobile ? Size.Small : Size.Medium,
        fontSize: isMobile ? Size.Medium : Size.Large,
        fontFamily: font.Medium,
        background: `linear-gradient(135deg, ${Colors.ACCENT_COLOR} 0%, ${Colors.ACCENT_COLOR_LIGHT} 100%)`,
        boxShadow: '0 8px 25px rgba(139, 21, 255, 0.3)',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)',
        width: isMobile ? '100%' : 'auto',
    };

    const submitButtonContainerStyle: CSSProperties = {
        gridColumn: '1 / -1',
        display: 'flex',
        justifyContent: 'center',
        padding: Size.Small,
        borderRadius: Size.Small,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        background: Colors.TEXT_WHITE_COLOR,
        width: '100%',
        maxWidth: isMobile ? '100%' : '600px',
        margin: '0 auto',
    };

    const consentSectionStyle: CSSProperties = {
        paddingLeft: isMobile ? Size.Medium : Size.Large,
        paddingRight: isMobile ? Size.Medium : Size.Large,
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
    };

    const consentCheckboxStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'flex-start',
        gap: Size.Small,
        marginBottom: Size.Medium,
    };

    const checkboxInputStyle: CSSProperties = {
        width: '20px',
        height: '20px',
        marginTop: '2px',
        accentColor: Colors.ACCENT_COLOR,
        cursor: 'pointer',
    };

    const consentTextStyle: CSSProperties = {
        fontSize: Size.Small,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        lineHeight: '1.6',
        flex: 1,
        wordBreak: 'break-word',
    };

    const consentErrorStyle: CSSProperties = {
        color: Colors.TEXT_ERROR_COLOR,
        fontSize: Size.Small,
        marginTop: Size.Small,
        padding: Size.Small,
        backgroundColor: Colors.TEXT_ERROR_COLOR + '20',
        borderRadius: Size.Small,
        border: `1px solid ${Colors.TEXT_ERROR_COLOR}`,
    };

    return (
        <ContentLayout>
            <div style={pageContainerStyle}>
                {/* Debug indicator - remove this in production */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        background: isMobile ? '#ff4444' : '#44ff44',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 9999,
                    }}>
                        {isMobile ? 'MOBILE' : 'DESKTOP'} - {window.innerWidth}px
                    </div>
                )}

                <div style={headerStyle}>
                    <h1 style={titleStyle}>Create Interview Session</h1>
                    <p style={subtitleStyle}>
                        Set up your interview session by providing job details and resume information
                    </p>
                </div>

                <div style={mainContentStyle}>
                    <div style={leftSideStyle}>
                        
                        <div style={resumeModeToggleStyle}>
                            <button
                                style={resumeMode === 'upload' ? activeModeButtonStyle : inactiveModeButtonStyle}
                                onClick={() => setResumeMode('upload')}>
                                <Upload size={16} style={{ marginRight: '8px' }} />
                                Upload New Resume
                            </button>
                            
                            <button
                                style={resumeMode === 'existing' ? activeModeButtonStyle : inactiveModeButtonStyle}
                                onClick={() => setResumeMode('existing')}
                            >
                                <FileText size={16} style={{ marginRight: '8px' }} />
                                Use Existing Resume
                            </button>
                        </div>

                        <div
                            style={formSectionLeftStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = formSectionStyleHover.transform!;
                                e.currentTarget.style.boxShadow = formSectionStyleHover.boxShadow!;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = formSectionLeftStyle.boxShadow!;
                            }}
                        >
                            <h2 style={sectionTitleStyle}>
                                {resumeMode === 'upload' ? <Upload size={24} /> : <FileText size={24} />}
                                {resumeMode === 'upload' ? 'Upload Resume' : 'Select Existing Resume'}
                            </h2>

                            {resumeMode === 'upload' ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: Size.Medium,
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={fileUploadAreaStyle} onClick={() => fileInputRef.current?.click()}>
                                        <Upload style={fileUploadIconStyle} />
                                        <div style={fileUploadTextStyle}>
                                            Click to upload or drag and drop
                                        </div>
                                        <div style={fileUploadSubtextStyle}>
                                            PDF up to 10MB
                                        </div>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />

                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: Size.Small,
                                        overflowY: 'auto',
                                        backgroundColor: Colors.TEXT_WHITE_COLOR,
                                        borderRadius: Size.Small,
                                        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`
                                    }}>
                                        {formData.file && (
                                            <div style={selectedFileStyle}>
                                                <div style={fileInfoStyle}>
                                                    <FileText size={10} color={Colors.ACCENT_COLOR} />
                                                    <span>{formData.file.name}</span>
                                                    <span style={{ color: Colors.SECONDARY_TEXT_COLOR }}>
                                                        ({formatFileSize(formData.file.size)})
                                                    </span>
                                                </div>
                                                <button
                                                    style={removeFileButtonStyle}
                                                    onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}

                                        <div style={{
                                            padding: Size.Small,
                                            backgroundColor: Colors.ACCENT_COLOR_LIGHT,
                                            borderRadius: Size.Small,
                                            border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
                                            textAlign: 'center',
                                            marginTop: formData.file ? Size.Small : 0
                                        }}>
                                            <div style={{
                                                fontSize: Size.Small,
                                                color: Colors.SECONDARY_TEXT_COLOR,
                                                fontFamily: font.Regular
                                            }}>
                                                📄 Supported formats: PDF (Max 10MB)
                                            </div>
                                        </div>

                                        {errors.file && (
                                            <div style={{ 
                                                color: Colors.TEXT_ERROR_COLOR, 
                                                fontSize: Size.Small, 
                                                marginTop: Size.Small,
                                                padding: Size.Small,
                                                backgroundColor: Colors.TEXT_ERROR_COLOR + '20',
                                                borderRadius: Size.Small,
                                                border: `1px solid ${Colors.TEXT_ERROR_COLOR}`
                                            }}>
                                                {errors.file}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: Size.Medium,
                                    height: '100%',
                                    justifyContent: 'flex-start'
                                }}>
                                    <div style={{
                                            padding: Size.Medium,
                                            backgroundColor: Colors.ACCENT_COLOR_LIGHT + '20',
                                            borderRadius: Size.Small,
                                            border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
                                            textAlign: 'center',
                                            marginTop: Size.Small
                                        }}>
                                            <div style={{
                                                fontSize: '12px',
                                                color: Colors.SECONDARY_TEXT_COLOR,
                                                fontFamily: font.Regular
                                            }}>
                                                💡 Tip: Select the resume that best matches the job requirements
                                            </div>
                                    </div>
                                    
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: Size.Small,
                                        overflowY: 'auto',
                                        padding: Size.Small,
                                        backgroundColor: Colors.TEXT_WHITE_COLOR,
                                        borderRadius: Size.Small,
                                        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`
                                    }}>
                                        {existingResumes.map((resume) => (
                                            <div
                                                key={resume.id}
                                                style={{
                                                    ...existingResumeCardStyle,
                                                    ...(formData.resumeId === resume.id ? existingResumeCardSelectedStyle : {}),
                                                }}
                                                onClick={() => handleInputChange('resumeId', resume.id)}
                                                onMouseEnter={(e) => {
                                                    if (formData.resumeId !== resume.id) {
                                                        e.currentTarget.style.borderColor = existingResumeCardStyleHover.borderColor!;
                                                        e.currentTarget.style.backgroundColor = existingResumeCardStyleHover.backgroundColor!;
                                                        e.currentTarget.style.transform = existingResumeCardStyleHover.transform!;
                                                        e.currentTarget.style.boxShadow = existingResumeCardStyleHover.boxShadow!;
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (formData.resumeId !== resume.id) {
                                                        e.currentTarget.style.borderColor = existingResumeCardStyle.borderColor!;
                                                        e.currentTarget.style.backgroundColor = existingResumeCardStyle.backgroundColor!;
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
                                                    {formData.resumeId === resume.id && (
                                                        <div style={{ color: Colors.ACCENT_COLOR, fontSize: Size.Small }}>
                                                            ✓ Selected
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={resumeCardMetaStyle}>
                                                    Uploaded: {new Date(resume.uploadDate).toLocaleDateString()} • 
                                                    Size: {formatFileSize(resume.fileSize)}
                                                </div>
                                            </div>
                                        ))}

                                        
                                    </div>

                                    {errors.resumeId && (
                                        <div style={{ 
                                            color: Colors.TEXT_ERROR_COLOR, 
                                            fontSize: Size.Small, 
                                            marginTop: Size.Small,
                                            padding: Size.Small,
                                            backgroundColor: Colors.TEXT_ERROR_COLOR + '20',
                                            borderRadius: Size.Small,
                                            border: `1px solid ${Colors.TEXT_ERROR_COLOR}`
                                        }}>
                                            {errors.resumeId}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={rightSideStyle}>
                        <div
                            style={formSectionRightStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = formSectionStyleHover.transform!;
                                e.currentTarget.style.boxShadow = formSectionStyleHover.boxShadow!;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = formSectionRightStyle.boxShadow!;
                            }}
                        >
                            <h2 style={sectionTitleStyle}>
                                <Plus size={24} />
                                Job Details
                            </h2>

                            <div style={formGridStyle}>
                                <PrimaryTextField
                                    label="Position/Job Title"
                                    value={formData.position}
                                    onChange={(value) => handleInputChange('position', value)}
                                    placeholder="e.g., Senior Software Engineer"
                                    error={errors.position}
                                />

                                <PrimaryTextField
                                    label="Company"
                                    value={formData.company}
                                    onChange={(value) => handleInputChange('company', value)}
                                    placeholder="e.g., Google, Microsoft"
                                    error={errors.company}
                                />
                                
                                <div style={{display: 'flex', gap: Size.Small, flexDirection: isMobile ? 'column' : 'row'}}>
                                    <PrimaryDropdown
                                        label="Work Type"
                                        value={formData.workType}
                                        onChange={(value) => handleInputChange('workType', value)}
                                        options={workTypeOptions}
                                        placeholder="Work type"
                                        error={errors.workType}
                                    />

                                    <PrimaryDropdown
                                        label="Interview Type"
                                        value={formData.interviewType}
                                        onChange={(value) => handleInputChange('interviewType', value)}
                                        options={interviewTypeOptions}
                                        placeholder="Interview type"
                                        error={errors.interviewType}
                                    />
                                </div>
                                

                                <PrimaryDropdown
                                    label="Language"
                                    value={formData.language}
                                    onChange={(value) => handleInputChange('language', value)}
                                    options={languageOptions}
                                    placeholder="Select language"
                                    error={errors.language}
                                />

                                <PrimaryTextField
                                    label="Job Requirements"
                                    value={formData.jobRequirements}
                                    onChange={(value) => handleInputChange('jobRequirements', value)}
                                    placeholder="Describe the job requirements, skills needed, and any specific criteria..."
                                    error={errors.jobRequirements}
                                />
                                
                            </div>
                        </div>
                    </div>
                </div>

                <div style={consentSectionStyle}>
                    <div style={consentCheckboxStyle}>
                        <input
                            type="checkbox"
                            id="consent-checkbox"
                            checked={formData.consentGiven}
                            onChange={(e) => handleConsentChange(e.target.checked)}
                            style={checkboxInputStyle}
                        />
                        <label htmlFor="consent-checkbox" style={consentTextStyle}>
                            I here by consent to the collection, processing, and storage of my personal data, including but not limited to my resume, job application details, and interview responses, for the purpose of conducting this interview session and improving our services. I understand that my data will be processed in accordance with applicable data protection laws and our Privacy Policy. I have the right to withdraw my consent at any time by contacting our support team.
                        </label>
                    </div>

                    {errors.consentGiven && (
                        <div style={consentErrorStyle}>
                            {errors.consentGiven}
                        </div>
                    )}
                </div>

                <div style={submitButtonContainerStyle}>
                    <PrimaryButton
                        label="Create Interview Session"
                        onClick={handleSubmit}
                        style={submitButtonStyle}
                    />
                </div>
            </div>
        </ContentLayout>
    );
};

export default CreateInterviewPage;