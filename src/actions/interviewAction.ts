import type { CreateInterviewSessionResponse, CreateInterviewSessionWithExistingResumeRequest, GetChatHistoryBySessionTokenResp, GetInterviewSessionInformationResp } from "../interface/interviewInterface";

export const CREATE_SESSION_WITH_NEW_RESUME = 'CREATE_SESSION_WITH_NEW_RESUME';
export const CREATE_SESSION_WITH_EXISTING_RESUME = 'CREATE_SESSION_WITH_EXISTING_RESUME';
export const GET_CHAT_HISTORY_BY_SESSION_TOKEN = 'GET_CHAT_HISTORY_BY_SESSION_TOKEN';
export const SET_CHAT_HISTORY = 'SET_CHAT_HISTORY';
export const GET_INTERVIEW_SESSION_INFORMATION = 'GET_INTERVIEW_SESSION_INFORMATION';
export const SET_INTERVIEW_SESSION_INFORMATION = 'SET_INTERVIEW_SESSION_INFORMATION';

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

export const getChatHistoryBySessionToken = (session_token: string) => {
    return { type: GET_CHAT_HISTORY_BY_SESSION_TOKEN, payload: { session_token } };
};

export const setChatHistory = (payload: GetChatHistoryBySessionTokenResp) => {
    return { type: SET_CHAT_HISTORY, payload: { chatHistory: payload } };
};

export const getInterviewSessionInformation = (session_token: string) => {
    return { type: GET_INTERVIEW_SESSION_INFORMATION, payload: { session_token } };
};

export const setInterviewSessionInformation = (payload: GetInterviewSessionInformationResp) => {
    return { type: SET_INTERVIEW_SESSION_INFORMATION, payload: { interviewSessionInformation: payload } };
};