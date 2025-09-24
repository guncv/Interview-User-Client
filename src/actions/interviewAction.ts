import type { 
    CreateInterviewSessionResponse,
    CreateInterviewSessionWithExistingResumeRequest,
    GetChatHistoryBySessionTokenResp,
    GetInterviewSessionListResp,
    GetInterviewSessionListCursorReq,
    GetInterviewSessionListPageReq,
    GetInterviewSessionInformationResp,
    GetChatHistoryBySessionIDWithEvaluationReq,
    GetChatHistoryBySessionIDWithEvaluationResp } from "../interface/interviewInterface";

export const CREATE_SESSION_WITH_NEW_RESUME = 'CREATE_SESSION_WITH_NEW_RESUME';
export const CREATE_SESSION_WITH_EXISTING_RESUME = 'CREATE_SESSION_WITH_EXISTING_RESUME';
export const GET_CHAT_HISTORY_BY_SESSION_TOKEN = 'GET_CHAT_HISTORY_BY_SESSION_TOKEN';
export const SET_CHAT_HISTORY = 'SET_CHAT_HISTORY';

export const SET_END_INTERVIEW_SESSION_LOADING = 'SET_END_INTERVIEW_SESSION_LOADING';
export const SET_END_INTERVIEW_SESSION_FINISHED = 'SET_END_INTERVIEW_SESSION_FINISHED';

export const GET_INTERVIEW_SESSION_INFORMATION_BY_ID = 'GET_INTERVIEW_SESSION_INFORMATION_BY_ID';
export const SET_INTERVIEW_SESSION_INFORMATION_BY_ID = 'SET_INTERVIEW_SESSION_INFORMATION_BY_ID';

export const SET_CREATE_INTERVIEW_ERROR = 'SET_CREATE_INTERVIEW_ERROR';
export const SET_CREATE_INTERVIEW_SUCCESS = 'SET_CREATE_INTERVIEW_SUCCESS';

export const GET_INTERVIEW_SESSION_LIST_CURSOR = 'GET_INTERVIEW_SESSION_LIST_CURSOR';
export const GET_INTERVIEW_SESSION_LIST_PAGE = 'GET_INTERVIEW_SESSION_LIST_PAGE';
export const SET_INTERVIEW_SESSION_LIST = 'SET_INTERVIEW_SESSION_LIST';
export const DELETE_INTERVIEW_SESSION_BY_ID = 'DELETE_INTERVIEW_SESSION_BY_ID';

export const GET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION = 'GET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION';
export const SET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION = 'SET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION';
export const ADD_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION = 'ADD_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION';

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


export const setEndInterviewSessionLoadingAction = () => {
    return { type: SET_END_INTERVIEW_SESSION_LOADING };
};

export const setEndInterviewSessionFinishedAction = () => {
    return { type: SET_END_INTERVIEW_SESSION_FINISHED};
};

export const getInterviewSessionListCursorAction = (params: GetInterviewSessionListCursorReq) => {
    return { type: GET_INTERVIEW_SESSION_LIST_CURSOR, payload: params };
};

export const getInterviewSessionListPageAction = (params: GetInterviewSessionListPageReq) => {
    return { type: GET_INTERVIEW_SESSION_LIST_PAGE, payload: params };
};

export const setInterviewSessionList = (payload: GetInterviewSessionListResp) => {
    return { type: SET_INTERVIEW_SESSION_LIST, payload: { interviewSessionList: payload  } };
};

export const deleteInterviewSessionByIdAction = (payload: string) => {
    return { type: DELETE_INTERVIEW_SESSION_BY_ID, payload };
};

export const getInterviewSessionInformationById = (session_id: string) => {
    return { type: GET_INTERVIEW_SESSION_INFORMATION_BY_ID, payload: { session_id } };
};

export const setInterviewSessionInformationById = (payload: GetInterviewSessionInformationResp) => {
    return { type: SET_INTERVIEW_SESSION_INFORMATION_BY_ID, payload: { interviewSessionInformationById: payload } };
};

export const getChatHistoryBySessionIDWithEvaluation = (payload: GetChatHistoryBySessionIDWithEvaluationReq) => {
    return { type: GET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION, payload };
};

export const setChatHistoryBySessionIDWithEvaluation = (req: GetChatHistoryBySessionIDWithEvaluationResp) => {
    return { type: SET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION, payload: { chatHistoryBySessionIDWithEvaluation: req } };
};

export const addChatHistoryBySessionIDWithEvaluation = (payload: GetChatHistoryBySessionIDWithEvaluationReq) => {
    return { type: ADD_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION, payload };
};