import type { ListResumeRequest, ResumeResponse } from "../interface/resumeInterface";

export const LIST_RESUME = 'LIST_RESUME';
export const SET_RESUME_ERROR = 'SET_RESUME_ERROR';
export const SET_RESUME_SUCCESS = 'SET_RESUME_SUCCESS';

export const listResume = (payload: ListResumeRequest) => {
    return { type: LIST_RESUME, payload };
};

export const setResumeError = (message: string) => {
    return { type: SET_RESUME_ERROR, payload: { error: message } };
};

export const setResumeSuccess = (payload: ResumeResponse) => {
    return { type: SET_RESUME_SUCCESS, payload: { success: payload } };
};
