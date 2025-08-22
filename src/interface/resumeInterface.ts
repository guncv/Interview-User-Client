export interface ListResumeRequest {
    updatedAt?: string | null;
}

export interface ResumeContent {
    defaultResume: GetListResumeByIdResponse;
    resumes: GetListResumeByIdResponse[];
}

export interface GetListResumeByIdResponse {
    id: string;
    fileName: string;
    mimeType: string;
    byteSize: number;
    createdAt: string;
    updatedAt: string;
}

export interface ResumeResponse {
    count: number;
    resume_content: ResumeContent;
    last_updated_at: string | null;
}