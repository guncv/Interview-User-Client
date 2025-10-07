export interface InterviewRecording {
    id: string;
    title: string;
    description?: string;
    duration: number;
    fileSize: number;
    fileUrl: string;
    thumbnailUrl?: string;
    status: 'processing' | 'completed' | 'failed';
    tags: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface CreateInterviewRecordingRequest {
    title: string;
    description?: string;
    category: string;
    tags?: string[];
    file: File;
}

export interface UpdateInterviewRecordingRequest {
    id: string;
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
}

export interface DeleteInterviewRecordingRequest {
    id: string;
}

export interface InterviewRecordingFilters {
    category?: string;
    status?: 'processing' | 'completed' | 'failed';
    dateRange?: {
        startDate: string;
        endDate: string;
    };
    tags?: string[];
    durationRange?: {
        minDuration: number;
        maxDuration: number;
    };
}

export interface InterviewRecordingSearchParams {
    query: string;
    filters?: InterviewRecordingFilters;
    sortBy?: 'title' | 'createdAt' | 'duration' | 'fileSize';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface InterviewRecordingListResponse {
    recordings: InterviewRecording[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface InterviewRecordingStats {
    totalRecordings: number;
    totalDuration: number;
    totalFileSize: number;
    recordingsByStatus: {
        processing: number;
        completed: number;
        failed: number;
    };
    recordingsByCategory: Record<string, number>;
}

export interface CreateInterviewSessionWithNewResumeRequest {
    file: File;
    position: string;
    is_consent: boolean;
}

export interface CreateInterviewSessionWithExistingResumeRequest {
    resume_id: string;
    position: string;
    is_consent: boolean;
}

export interface CreateInterviewSessionResponse {
    session_token: string;
}

export interface GetInterviewSessionInformationReq {
    session_token: string;
}

export interface GetInterviewSessionInformationResp {
	resume_id: string;
	resume_file_name: string;
	position: string;
	status: string;
	status_display_name: string;
	status_color: string;
	started_at: string;
	ended_at: string;
	total_time: string;
	overall_score: number;
	overall_score_percent: string;
	overall_score_color: string;
	summary_md: string;
	created_at: string;
	created_at_full_name: string;
}

export interface InterviewSessionSummary {
	id: string;
	resume_id: string;
	resume_file_name: string;
	position: string;
	status: string;
	status_color: string;
	total_time: string;
	overall_score: number;
	overall_score_color: string;
	created_at: string;
}

export interface Cursor {
	created_at: string;
	id: string;
}

export interface GetInterviewSessionListResp {
	sessions   : InterviewSessionSummary[];
	prev_cursor: Cursor | null;
	next_cursor: Cursor | null;
	total_pages: number;
	page_size: number;
}

export interface GetInterviewSessionListCursorReq {	
	cursor_id?: string;
	cursor_created_at?: string;
	limit?: number;
	search_text?: string;
    type?: string;
}

export interface GetInterviewSessionListPageReq {
	offset?: number;
	limit?: number;
	search_text?: string;
}

export interface GetFinalizingSessionsResp {
	sessions: FinalizingInterviewSessionSummary[];
	total_count: number;
}

export interface FinalizingInterviewSessionSummary {
	id: string;
	resume_id: string;
	resume_file_name: string;
	position: string;
	status: string;
	status_color: string;
	total_time: string;
	created_at: string;
}

export interface InterviewSession {
    id: string;
    session_token: string;
    position: string;
    file_name: string;
}

export interface JobRequirement {
    id: string;
    requirement: string;
    isRequired: boolean;
}

export interface CreateInterviewFormErrors {
    file?: string;
    resumeId?: string;
    position?: string;
    consentAt?: string;
    consentGiven?: string;
}

export interface GetChatHistoryBySessionTokenReq {
	session_token: string;
	turn_no: number | null;
}

export interface GetChatHistoryBySessionTokenResp {
	chat_history: ChatHistory[];
	cursor_turn_next: number;
}

export interface ChatHistory {
	id: string;
	turn_no: number;
	actor : string;
	transcript_text: string;
	start_at: string;
	end_at: string;
	created_at: string;
	phrase_name?: string;

	feedback_score?: number;
	max_feedback_score?: number;
	improved_sentence?: string;
	feedback_categories?: TurnFeedbackCategory[];
}

export interface TurnFeedbackCategory {
	category: string;
	score: number;
	max_score: number;
	description: string;
	improvement_suggestion?: string;
}

export interface InterviewEvaluation {
	id: string;
	session_id: string;
	overall_score: number;
	status: 'completed' | 'processing' | 'failed';
	created_at: string;
	feedback: EvaluationFeedback;
	analytics: EvaluationAnalytics;
}

export interface EvaluationFeedback {
	coaching: CoachingFeedback[];
	strengths: string[];
	improvements: string[];
	general_feedback: string;
}

export interface CoachingFeedback {
	category: string;
	score: number;
	max_score: number;
	description: string;
	insights: string[];
	subcategories?: SubCategoryScore[];
}

export interface SubCategoryScore {
	name: string;
	score: number;
	max_score: number;
	description: string;
}

export interface EvaluationAnalytics {
	total_duration: number;
	speaking_time: {
		user: number;
		interviewer: number;
	};
	response_times: number[];
	keywords_used: string[];
	confidence_score: number;
	clarity_score: number;
}

export interface VideoPlayerProps {
	sessionId: string;
	videoUrl?: string;
	transcript: ChatHistory[];
	onTimeUpdate?: (time: number) => void;
}

export interface EvaluationTabsProps {
	feedback: EvaluationFeedback;
	analytics: EvaluationAnalytics;
	activeTab: 'coaching' | 'analytics';
	onTabChange: (tab: 'coaching' | 'analytics') => void;
}


export interface GetChatHistoryBySessionIDWithEvaluationReq {
	session_id: string;
	turn_no: number | null;
}

export interface GetChatHistoryBySessionIDWithEvaluationResp {
	chat_history: ChatHistoryWithEvaluation[];
	cursor_turn_next: number;
}

export interface ChatHistoryWithEvaluation {
	id: string;
	turn_no: number;
	actor: string;
	content: string;
	start_at: string;
	end_at: string;
	evaluation: Evaluation | null;
	corrected_sentence: string | null;
	current_state: string;
	current_state_color: string;
}

export interface Evaluation {
	overall_score: string;
	overall_color: string;
	summary_md: string;
	scores: CriteriaScore[];
}

export interface CriteriaScore {
	criterion_id: string;
	criterion_name: string;
	score: string;
	score_color: string;
	comment_md: string;
}
