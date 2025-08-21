import { useState, useRef, type CSSProperties } from 'react';
import { Upload, FileText, Plus, X } from 'lucide-react';
import ContentLayout from "../components/layout/ContentLayout";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { PrimaryTextField } from "../components/common/PrimaryTextField";
import { PrimaryTextArea } from "../components/common/PrimaryTextArea";
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
    const { isMobile, isTablet } = useContextProvider();
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
        { value: 'th', label: 'Thai' },
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
            consentAt: checked ? new Date() : prev.consentAt // Keep existing date when unchecking
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
            newErrors.position = 'required';
        }

        if (!formData.company.trim()) {
            newErrors.company = 'required';
        }

        if (!formData.workType) {
            newErrors.workType = 'required';
        }

        if (!formData.jobRequirements.trim()) {
            newErrors.jobRequirements = 'required';
        }

        if (!formData.interviewType) {
            newErrors.interviewType = 'required';
        }

        if (!formData.language) {
            newErrors.language = 'required';
        }

        if (!formData.consentGiven) {
            newErrors.consentGiven = 'You must give consent to continue';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormComplete = (): boolean => {
        // Check if all required fields are filled
        const hasResume = resumeMode === 'upload' ? !!formData.file : !!formData.resumeId;
        const hasRequiredFields = !!formData.position.trim() && 
                                !!formData.company.trim() && 
                                !!formData.workType && 
                                !!formData.jobRequirements.trim() && 
                                !!formData.interviewType && 
                                !!formData.language;
        
        // Check if consent is given
        const hasConsent = !!formData.consentGiven;
        
        return hasResume && hasRequiredFields && hasConsent;
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
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        overflow: 'auto',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        paddingBottom: isMobile || isTablet ? '80px' : '40px',
    };

    const headerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'left',
        marginBottom: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Large,
        alignItems: 'center',
    };

    const titleStyle: CSSProperties = {
        fontSize: isMobile ? Size.Medium : isTablet ? Size.LargeMedium : Size.Large,
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
        fontSize: isMobile ? Size.Small : isTablet ? Size.Small : Size.Medium,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        lineHeight: '1.6',
        wordWrap: 'break-word',
    };

    const mainContentStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr',
        gap: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
        marginBottom: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
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
        gap: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
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
        gap: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
        overflow: 'auto',
        width: '100%',
        ...(isMobile && {
            gridArea: 'right',
        }),
    };

    const resumeModeToggleStyle: CSSProperties = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : isTablet ? 'row' : 'row',
        gap: isMobile ? Size.Small : isTablet ? Size.Small : Size.Small,
        marginBottom: Size.Small,
        background: `linear-gradient(135deg, ${Colors.TEXT_WHITE_COLOR} 0%, ${Colors.LECTURE_CONTENT_PART_COLOR} 100%)`,
        borderRadius: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        width: '100%',
        fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        fontFamily: font.Regular,
    };

    const modeButtonStyle: CSSProperties = {
        flex: 1,
        padding: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        border: 'none',
        borderRadius: Size.Small,
        fontFamily: font.Medium,
        fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        minHeight: isMobile ? '44px' : isTablet ? '48px' : 'auto',
    };

    const activeModeButtonStyle: CSSProperties = {
        ...modeButtonStyle,
        background: `linear-gradient(135deg, ${Colors.ACCENT_COLOR} 0%, ${Colors.ACCENT_COLOR_LIGHT} 100%)`,
        color: Colors.TEXT_WHITE_COLOR,
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
        padding: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        height: isMobile ? 'auto' : isTablet ? '450px' : '500px',
        minHeight: isMobile ? '400px' : isTablet ? '450px' : '500px',
        position: 'relative',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: isMobile ? '100%' : isTablet ? '450px' : '500px',
        ...(isMobile && {
            marginBottom: Size.Medium,
        }),
    };

    const formSectionRightStyle: CSSProperties = {
        borderRadius: Size.Small,
        padding: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
        minHeight: isMobile ? 'auto' : isTablet ? '550px' : '600px',
        maxHeight: isMobile ? 'none' : isTablet ? '550px' : '600px',
        position: 'relative',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: isMobile ? '100%' : isTablet ? '450px' : '500px',
    };


    const sectionTitleStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        fontFamily: font.Regular,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Medium,
        display: 'flex',
        width: '100%',
        maxWidth: isMobile ? '100%' : isTablet ? '500px' : '600px',
        alignItems: 'start',
        gap: Size.Small,
        paddingBottom: Size.Small,
        borderBottom: `2px solid ${Colors.ACCENT_COLOR_LIGHT}`,
        flexWrap: 'wrap',
    };

    const fileUploadAreaStyle: CSSProperties = {
        border: `2px dashed ${Colors.ACCENT_COLOR}`,
        borderRadius: Size.Small,
        padding: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: `linear-gradient(135deg, ${Colors.ACCENT_COLOR_LIGHT} 0%, ${Colors.TEXT_WHITE_COLOR} 100%)`,
        height: isMobile ? '200px' : isTablet ? '220px' : '250px',
        display: 'flex',
        width: '100%',
        maxWidth: isMobile ? '100%' : isTablet ? '350px' : '400px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        flex: 'none',
    };

    const fileUploadIconStyle: CSSProperties = {
        width: isMobile ? '35px' : isTablet ? '40px' : '45px',
        height: isMobile ? '30px' : isTablet ? '35px' : '40px',
        color: Colors.ACCENT_COLOR,
        margin: '0 auto',
        marginBottom: Size.Medium,
        transition: 'all 0.3s ease',
    };

    const fileUploadTextStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Small,
        textAlign: 'center',
        padding: isMobile ? '0 10px' : isTablet ? '0 15px' : '0',
    };

    const fileUploadSubtextStyle: CSSProperties = {
        fontSize: Size.Small,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        opacity: 0.8,
        textAlign: 'center',
        padding: isMobile ? '0 10px' : isTablet ? '0 15px' : '0',
    };

    const selectedFileStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? Size.Small : isTablet ? Size.Small : Size.Small,
        borderRadius: Size.Small,
        border: `2px solid ${Colors.ACCENT_COLOR}`,
        marginTop: Size.Medium,
        transition: 'all 0.3s ease',
        flexWrap: isMobile ? 'wrap' : isTablet ? 'nowrap' : 'nowrap',
        gap: isMobile ? Size.Small : isTablet ? Size.Small : Size.Small,
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
    };

    const existingResumeCardStyle: CSSProperties = {
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

    const existingResumeCardStyleHover: CSSProperties = {
        borderColor: Colors.ACCENT_COLOR,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        transform: 'translateX(8px)',
    };

    const existingResumeCardSelectedStyle: CSSProperties = {
        borderColor: Colors.ACCENT_COLOR,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        transform: 'translateX(8px)',
    };

    const resumeCardHeaderStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Size.Small,
    };

    const resumeCardTitleStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
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
        gap: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        marginBottom: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
    };

    const submitButtonStyle: CSSProperties = {
        padding: isMobile ? Size.Small : isTablet ? Size.Small : Size.Small,
        fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        height: isMobile ? '40px' : isTablet ? '40px' : '40px',
        width: isMobile ? '100%' : isTablet ? 'auto' : 'auto',
        fontFamily: font.Medium,
        background: isFormComplete() ? Colors.ACCENT_COLOR : Colors.DISABLED_TEXT_COLOR,
        cursor: isFormComplete() ? 'pointer' : '',
        opacity: isFormComplete() ? 1 : 0.6,
        transition: 'all 0.3s ease',
    };

    const consentSectionStyle: CSSProperties = {
        paddingLeft: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
        paddingRight: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
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
        fontSize: isMobile ? Size.Small : isTablet ? '13px' : '13px',
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
                <div style={headerStyle}>
                    <div >
                        <h1 style={titleStyle}>Create Interview Session</h1>
                        <p style={subtitleStyle}>
                            Set up your interview session by providing job details and resume information
                        </p>
                    </div>
                    
                    {
                        !isMobile && (
                            <PrimaryButton
                                label="Create Interview Session"
                                onClick={handleSubmit}
                                style={submitButtonStyle}
                                isDisabled={!isFormComplete()}
                            />
                        )
                    }
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
                                                        e.currentTarget.style.transform = existingResumeCardStyleHover.transform!;
                                                        e.currentTarget.style.boxShadow = existingResumeCardStyleHover.boxShadow!;
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (formData.resumeId !== resume.id) {
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
                                
                                <div style={{display: 'flex', gap: Size.Small, flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row'}}>
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

                                <PrimaryTextArea
                                    label="Job Requirements"
                                    value={formData.jobRequirements}
                                    onChange={(value) => handleInputChange('jobRequirements', value)}
                                    placeholder="Describe the job requirements, skills needed, and any specific criteria..."
                                    error={errors.jobRequirements}
                                    rows={3}
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

                {

                    isMobile && (
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: Size.Medium,
                        }}>
                            <PrimaryButton
                                label="Create Interview Session"
                                onClick={handleSubmit}
                                style={submitButtonStyle}
                                isDisabled={!isFormComplete()}
                            />
                        </div>
                    )
                }
            </div>
        </ContentLayout>
    );
};

export default CreateInterviewPage;