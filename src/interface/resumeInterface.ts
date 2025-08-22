export interface ListResumeRequest {
    updatedAt?: string | null;
}

export interface ResumeContent {
    default_resume: GetResumeByIdResponse;
    resumes: GetListResumeByIdResponse[];
}

export interface GetResumeByIdResponse {
    id: string;
	file_name: string;
	mime_type: string;
	byte_size: number;
	file_url: string;
	created_at: string;
	updated_at: string;
}

export interface GetListResumeByIdResponse {
    id: string;
    file_name: string;
    mime_type: string;
    byte_size: number;
    created_at: string;
    updated_at: string;
}

export interface ResumeResponse {
    count: number;
    resume_content: ResumeContent | null;
    last_updated_at: string | null;
}

export interface Resume {
    id: string;
    file_name: string;
    mime_type: string;
    byte_size: number;
    created_at: string;
    updated_at: string;
}