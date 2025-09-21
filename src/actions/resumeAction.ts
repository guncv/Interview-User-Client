import type { ListResumeRequest, ResumeResponse, GetResumeByIdResponse } from "../interface/resumeInterface";

export const LIST_RESUME = 'LIST_RESUME';
export const SET_RESUME_ERROR = 'SET_RESUME_ERROR';
export const SET_RESUME_SUCCESS = 'SET_RESUME_SUCCESS';

export const GET_RESUME_BY_ID = 'GET_RESUME_BY_ID';
export const SET_RESUME_BY_ID_ERROR = 'SET_RESUME_BY_ID_ERROR';
export const SET_RESUME_BY_ID_SUCCESS = 'SET_RESUME_BY_ID_SUCCESS';
export const DOWNLOAD_RESUME_BY_RESUME_ID = 'DOWNLOAD_RESUME_BY_RESUME_ID';

export const listResume = (payload: ListResumeRequest) => {
    return { type: LIST_RESUME, payload };
};

export const setResumeError = (message: string) => {
    return { type: SET_RESUME_ERROR, payload: { error: message } };
};

export const setResumeSuccess = (payload: ResumeResponse) => {
    return { type: SET_RESUME_SUCCESS, payload: { success: payload } };
};

export const getResumeById = (id: string) => {
    return { type: GET_RESUME_BY_ID, payload: { id: id } };
};

export const setResumeByIdError = (message: string) => {
    return { type: SET_RESUME_BY_ID_ERROR, payload: { error: message } };
};

export const setResumeByIdSuccess = (payload: GetResumeByIdResponse) => {
    return { type: SET_RESUME_BY_ID_SUCCESS, payload: { resumeById: payload } };
};

export const downloadResumeByResumeId = (resume_id: string) => {
    return { type: DOWNLOAD_RESUME_BY_RESUME_ID, payload: { resume_id: resume_id } };
};