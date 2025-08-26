import { useEffect, useState } from 'react';
import { Upload, FileText, Plus } from 'lucide-react';
import ContentLayout from "../components/layout/ContentLayout";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { PrimaryTextField } from "../components/common/PrimaryTextField";
import { PrimaryTextArea } from "../components/common/PrimaryTextArea";
import { PrimaryDropdown } from "../components/common/PrimaryDropdown";
import { ResumeList, FileUpload } from "../components/common";
import Colors from "../assets/styles/Color";
import Size from "../assets/styles/Size";
import font from "../assets/styles/Font";
import { useContextProvider } from "../components/layout/ContextProvider";
import type {
  CreateInterviewSessionWithExistingResumeRequest,
  CreateInterviewFormErrors,
} from "../interface/interviewInterface";
import type { ResumeContent } from '../interface/resumeInterface';
import { useDispatch, useSelector } from 'react-redux';
import { resumeSelector } from '../reducers/resumeReducer';
import { listResume } from '../actions/resumeAction';
import { createInterviewSessionWithExistingResume, setCreateInterviewSuccess, setCreateInterviewError } from '../actions/interviewAction';
import { API_ENDPOINTS, HTTP_STATUS, ROUTES } from '../constants';
import { axiosInstance } from '../api/axiosInstance';
import { safeNavigate } from '../utils';

type ResumeMode = 'upload' | 'existing';

interface FormDataState {
  file: File | null;
  resumeId: string;
  position: string;
  company: string;
  workType: string;
  jobRequirements: string;
  interviewType: string;
  language: string;
  consentGiven: boolean;
}

type EditableField = Exclude<keyof FormDataState, 'file' | 'consentGiven'>;

const CreateInterviewPage = () => {
  const { isMobile, isTablet } = useContextProvider();
  const dispatch = useDispatch();
  const [resumeList, setResumeList] = useState<ResumeContent | null>(null);
  const [resumeCount, setResumeCount] = useState<number>(0);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const { success, error } = useSelector(resumeSelector);
  const [resumeMode, setResumeMode] = useState<ResumeMode>('upload');
  const [formData, setFormData] = useState<FormDataState>({
    file: null,
    resumeId: '',
    position: '',
    company: '',
    workType: '',
    jobRequirements: '',
    interviewType: '',
    language: '',
    consentGiven: false,
  });

  const [errors, setErrors] = useState<CreateInterviewFormErrors>({});

  useEffect(() => {
    dispatch(listResume({
      updatedAt: updatedAt,
    }));
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
    if (success) {
      setUpdatedAt(success.last_updated_at);
      console.log(success);
      setResumeList(success.resume_content);
      setResumeCount(success.count);
    }
  }, [success, error]);


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

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, file }));
    setErrors(prev => ({ ...prev, file: undefined }));
  };

  const handleInputChange = <K extends EditableField>(
    field: K,
    value: FormDataState[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined } as CreateInterviewFormErrors));
  };

  const handleConsentChange = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      consentGiven: checked,
    }));
    setErrors(prev => ({ ...prev, consentGiven: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: CreateInterviewFormErrors = {};

    if (resumeMode === 'upload' && !formData.file) newErrors.file = 'Please select a resume file';
    if (resumeMode === 'existing' && !formData.resumeId) newErrors.resumeId = 'Please select an existing resume';
    if (!formData.position.trim()) newErrors.position = 'required';
    if (!formData.company.trim()) newErrors.company = 'required';
    if (!formData.workType) newErrors.workType = 'required';
    if (!formData.jobRequirements.trim()) newErrors.jobRequirements = 'required';
    if (!formData.interviewType) newErrors.interviewType = 'required';
    if (!formData.language) newErrors.language = 'required';
    if (!formData.consentGiven) newErrors.consentGiven = 'You must give consent to continue';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete = (): boolean => {
    const hasResume = resumeMode === 'upload' ? !!formData.file : !!formData.resumeId;
    const hasRequiredFields =
      !!formData.position.trim() &&
      !!formData.company.trim() &&
      !!formData.workType &&
      !!formData.jobRequirements.trim() &&
      !!formData.interviewType &&
      !!formData.language;

    const hasConsent = !!formData.consentGiven;

    return hasResume && hasRequiredFields && hasConsent;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (resumeMode === 'upload') {
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.file! as File);
        formDataToSend.append('position', formData.position as string);
        formDataToSend.append('company', formData.company as string);
        formDataToSend.append('work_type', formData.workType as string);
        formDataToSend.append('job_requirements', formData.jobRequirements as string);
        formDataToSend.append('interview_type', formData.interviewType as string);
        formDataToSend.append('language', formData.language as string);
        formDataToSend.append('is_consent', formData.consentGiven.toString() as string);

        console.log('Creating interview with new resume:', formDataToSend);
        
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.CREATE_SESSION_WITH_NEW_RESUME, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          console.log('Interview created successfully:', response.data);
          dispatch(setCreateInterviewSuccess(response.data));
        } catch (error: any) {
          console.error('Failed to create interview:', error);

          if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
            safeNavigate(ROUTES.SIGN_IN);
            return;
          }
          
          const errorMessage = error.response?.data?.message || 'Failed to create interview';
          dispatch(setCreateInterviewError(errorMessage));
        }
      } else {
        const request: CreateInterviewSessionWithExistingResumeRequest = {
          resume_id: formData.resumeId,
          position: formData.position,
          company: formData.company,
          work_type: formData.workType,
          job_requirements: formData.jobRequirements,
          interview_type: formData.interviewType,
          language: formData.language,
          is_consent: formData.consentGiven,
        };
        console.log('Creating interview with existing resume:', request);
        dispatch(createInterviewSessionWithExistingResume(request));
      }
    } catch (error) {
      console.error('Error creating interview session:', error);
    }
  };

  return (
    <ContentLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
          overflow: 'auto',
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100vw',
          paddingBottom: (isMobile || isTablet) ? '80px' : '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'left',
            marginBottom: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Large,
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: isMobile ? Size.Medium : isTablet ? Size.LargeMedium : Size.Large,
                fontFamily: font.Regular,
                color: Colors.PRIMARY_COLOR,
                marginBottom: Size.Small,
                background: `linear-gradient(135deg, ${Colors.PRIMARY_COLOR} 0%, ${Colors.ACCENT_COLOR} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                wordWrap: 'break-word',
              }}
            >
              Create Interview Session
            </h1>
            <p
              style={{
                fontSize: isMobile ? Size.Small : isTablet ? Size.Small : Size.Medium,
                fontFamily: font.Regular,
                color: Colors.SECONDARY_TEXT_COLOR,
                lineHeight: '1.6',
                wordWrap: 'break-word',
              }}
            >
              Set up your interview session by providing job details and resume information
            </p>
          </div>

          {!isMobile && (
            <PrimaryButton
              label="Create Interview Session"
              onClick={handleSubmit}
              style={{
                padding: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
                fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
                height: '40px',
                width: 'auto',
                fontFamily: font.Medium,
                background: isFormComplete() ? Colors.ACCENT_COLOR : Colors.DISABLED_TEXT_COLOR,
                cursor: isFormComplete() ? 'pointer' : 'default',
                opacity: isFormComplete() ? 1 : 0.6,
                transition: 'all 0.3s ease',
              }}
              isDisabled={!isFormComplete()}
            />
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? Size.Medium : Size.Large,
            marginBottom: isMobile ? Size.Medium : Size.Large,
            alignItems: 'start',
            width: '100%',
            ...(isMobile
              ? {
                  gridTemplateRows: 'auto auto',
                  gridTemplateAreas: '"left" "right"',
                }
              : {}),
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? Size.Small : Size.Medium,
              minHeight: 'fit-content',
              alignItems: 'center',
              width: '100%',
              ...(isMobile
                ? {
                    gridArea: 'left',
                    marginBottom: Size.Medium,
                  }
                : {}),
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: Size.Small,
                marginBottom: Size.Small,
                background: `linear-gradient(135deg, ${Colors.TEXT_WHITE_COLOR} 0%, ${Colors.LECTURE_CONTENT_PART_COLOR} 100%)`,
                borderRadius: Size.Small,
                border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
                width: '100%',
                justifyContent: 'center',
                fontSize: isMobile ? Size.Small : Size.Medium,
                fontFamily: font.Regular,
              }}
            >
              <button
                style={
                  resumeMode === 'upload'
                    ? {
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
                        minHeight: isMobile ? '44px' : '48px',
                        background: `linear-gradient(135deg, ${Colors.ACCENT_COLOR} 0%, ${Colors.ACCENT_COLOR_LIGHT} 100%)`,
                        color: Colors.TEXT_WHITE_COLOR,
                        transform: 'translateY(-2px)',
                    }
                    : {
                        padding: isMobile ? Size.Small : Size.Medium,
                        border: 'none',
                        borderRadius: Size.Small,
                        fontFamily: font.Regular,
                        fontSize: isMobile ? Size.Small : Size.Medium,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        minHeight: isMobile ? '44px' : '48px',
                        background: 'transparent',
                        color: Colors.SECONDARY_TEXT_COLOR,
                    }
                }
                onClick={() => setResumeMode('upload')}
            >
                <Upload size={16} style={{ marginRight: '8px' }} />
                Upload New Resume
            </button>

            <button
                style={
                resumeMode === 'existing'
                    ? {
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
                        minHeight: isMobile ? '44px' : '48px',
                        background: `linear-gradient(135deg, ${Colors.ACCENT_COLOR} 0%, ${Colors.ACCENT_COLOR_LIGHT} 100%)`,
                        color: Colors.TEXT_WHITE_COLOR,
                        transform: 'translateY(-2px)',
                    }
                    : {
                        padding: isMobile ? Size.Small : Size.Medium,
                        border: 'none',
                        borderRadius: Size.Small,
                        fontFamily: font.Regular,
                        fontSize: isMobile ? Size.Small : Size.Medium,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        minHeight: isMobile ? '44px' : '48px',
                        background: 'transparent',
                        color: Colors.SECONDARY_TEXT_COLOR,
                    }
                }
                onClick={() => setResumeMode('existing')}
                >
                <FileText size={16} style={{ marginRight: '8px' }} />
                Use Existing Resume
                </button>
            </div>

            <div
                style={{
                borderRadius: Size.Small,
                padding: isMobile ? Size.Medium : Size.Large,
                border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
                height: isMobile ? 'auto' : isTablet ? '450px' : '500px',
                minHeight: isMobile ? '400px' : isTablet ? '450px' : '500px',
                position: 'relative',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: isMobile ? '100%' : isTablet ? '450px' : '500px',
                ...(isMobile ? { marginBottom: Size.Medium } : {}),
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? Size.Small : Size.Medium,
                  fontFamily: font.Regular,
                  color: Colors.PRIMARY_COLOR,
                  marginBottom: Size.Medium,
                  display: 'flex',
                  width: '100%',
                  maxWidth: isMobile ? '100%' : '600px',
                  alignItems: 'flex-start',
                  gap: Size.Small,
                  paddingBottom: Size.Small,
                  borderBottom: `2px solid ${Colors.ACCENT_COLOR_LIGHT}`,
                  flexWrap: 'wrap',
                }}
              >
                {resumeMode === 'upload' ? <Upload size={24} /> : <FileText size={24} />}
                {resumeMode === 'upload' ? 'Upload Resume' : 'Select Existing Resume'}
              </h2>

              {resumeMode === 'upload' ? (
                <FileUpload
                  file={formData.file}
                  onFileChange={handleFileChange}
                  error={errors.file}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              ) : (
                <ResumeList
                  resumeCount={resumeCount}
                  resumes={resumeList || {
                    default_resume: {
                      id: '',
                      file_name: '',
                      mime_type: '',
                      byte_size: 0,
                      file_url: '',
                      created_at: '',
                      updated_at: '',
                    },
                    resumes: [],
                  }}
                  selectedResumeId={formData.resumeId}
                  onResumeSelect={(id: string) => handleInputChange('resumeId', id)}
                  error={errors.resumeId}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? Size.Medium : Size.Large,
              overflow: 'auto',
              width: '100%',
              ...(isMobile ? { gridArea: 'right' } : {}),
            }}
          >
            <div
              style={{
                borderRadius: Size.Small,
                padding: isMobile ? Size.Medium : Size.Large,
                minHeight: isMobile ? 'auto' : isTablet ? '550px' : '600px',
                maxHeight: isMobile ? 'none' : isTablet ? '550px' : '600px',
                position: 'relative',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: isMobile ? '100%' : isTablet ? '450px' : '500px',
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? Size.Small : Size.Medium,
                  fontFamily: font.Regular,
                  color: Colors.PRIMARY_COLOR,
                  marginBottom: Size.Medium,
                  display: 'flex',
                  width: '100%',
                  maxWidth: isMobile ? '100%' : '600px',
                  alignItems: 'flex-start',
                  gap: Size.Small,
                  paddingBottom: Size.Small,
                  borderBottom: `2px solid ${Colors.ACCENT_COLOR_LIGHT}`,
                  flexWrap: 'wrap',
                }}
              >
                <Plus size={24} />
                Job Details
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? Size.Small : Size.Medium,
                  marginBottom: isMobile ? Size.Small : Size.Medium,
                }}
              >
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

                <div style={{ display: 'flex', gap: Size.Small, flexDirection: isMobile ? 'column' : 'row' }}>
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

        <div
          style={{
            paddingLeft: isMobile ? Size.Medium : Size.Large,
            paddingRight: isMobile ? Size.Medium : Size.Large,
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: Size.Small,
              marginBottom: Size.Medium,
            }}
          >
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={formData.consentGiven}
              onChange={(e) => handleConsentChange(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                marginTop: '2px',
                accentColor: Colors.ACCENT_COLOR,
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor="consent-checkbox"
              style={{
                fontSize: isMobile ? Size.Small : '13px',
                fontFamily: font.Regular,
                color: Colors.SECONDARY_TEXT_COLOR,
                lineHeight: '1.6',
                flex: 1,
                wordBreak: 'break-word',
              }}
            >
              I hereby consent to the collection, processing, and storage of my personal data, including but not limited to my resume, job application details, and interview responses, for the purpose of conducting this interview session and improving our services. I understand that my data will be processed in accordance with applicable data protection laws and our Privacy Policy. I have the right to withdraw my consent at any time by contacting our support team.
            </label>
          </div>

          {errors.consentGiven && (
            <div
              style={{
                color: Colors.TEXT_ERROR_COLOR,
                fontSize: Size.Small,
                marginTop: Size.Small,
                padding: Size.Small,
                backgroundColor: Colors.TEXT_ERROR_COLOR + '20',
                borderRadius: Size.Small,
                border: `1px solid ${Colors.TEXT_ERROR_COLOR}`,
              }}
            >
              {errors.consentGiven}
            </div>
          )}
        </div>

        {isMobile && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: Size.Medium,
            }}
          >
            <PrimaryButton
              label="Create Interview Session"
              onClick={handleSubmit}
              style={{
                padding: Size.Small,
                fontSize: isMobile ? Size.Small : Size.Medium,
                height: '40px',
                width: '100%',
                fontFamily: font.Medium,
                background: isFormComplete() ? Colors.ACCENT_COLOR : Colors.DISABLED_TEXT_COLOR,
                cursor: isFormComplete() ? 'pointer' : 'default',
                opacity: isFormComplete() ? 1 : 0.6,
                transition: 'all 0.3s ease',
              }}
              isDisabled={!isFormComplete()}
            />
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default CreateInterviewPage;
