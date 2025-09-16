import type { CreateInterviewSessionResponse, CreateInterviewSessionWithExistingResumeRequest } from "../interface/interviewInterface";

export const CREATE_SESSION_WITH_NEW_RESUME = 'CREATE_SESSION_WITH_NEW_RESUME';
export const CREATE_SESSION_WITH_EXISTING_RESUME = 'CREATE_SESSION_WITH_EXISTING_RESUME';

export const SET_CREATE_INTERVIEW_ERROR = 'SET_CREATE_INTERVIEW_ERROR';
export const SET_CREATE_INTERVIEW_SUCCESS = 'SET_CREATE_INTERVIEW_SUCCESS';

export const setCreateInterviewError = (message: string) => {
    return { type: SET_CREATE_INTERVIEW_ERROR, payload: { error: message } };
};

export const setCreateInterviewSuccess = (payload: CreateInterviewSessionResponse) => {
    return { type: SET_CREATE_INTERVIEW_SUCCESS, payload: { success: payload } };
};

export const createInterviewSessionWithNewResume = (payload: {
    position: string;
    is_consent: string;
}) => {
    return { type: CREATE_SESSION_WITH_NEW_RESUME, payload };
};

export const createInterviewSessionWithExistingResume = (payload: CreateInterviewSessionWithExistingResumeRequest) => {
    return { type: CREATE_SESSION_WITH_EXISTING_RESUME, payload };
};