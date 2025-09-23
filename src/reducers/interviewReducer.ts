import { createSelector } from '@reduxjs/toolkit';
import {
    SET_CREATE_INTERVIEW_ERROR,
    SET_CREATE_INTERVIEW_SUCCESS,
    SET_CHAT_HISTORY,
    SET_INTERVIEW_SESSION_INFORMATION,
    SET_INTERVIEW_SESSION_LIST,
} from '../actions/interviewAction';
import type { RootState } from './rootReducer';
import type { CreateInterviewSessionResponse, GetChatHistoryBySessionTokenResp, GetInterviewSessionInformationResp, GetInterviewSessionListResp } from '../interface/interviewInterface';

type InterviewState = {
    error: string;
    success: CreateInterviewSessionResponse;
    chatHistory: GetChatHistoryBySessionTokenResp;
    interviewSessionInformation: GetInterviewSessionInformationResp;
    interviewSessionList: GetInterviewSessionListResp;
}
type InterviewStateAction = {
    type: string;
    payload: {
        error: string;
        success: CreateInterviewSessionResponse;
        chatHistory: GetChatHistoryBySessionTokenResp;
        interviewSessionInformation: GetInterviewSessionInformationResp;
        interviewSessionList: GetInterviewSessionListResp;
    }
}
const initialState: InterviewState = {
    error: '',
    success: {
        session_token: '',
    },
    chatHistory: {
        chat_history: [],
    },
    interviewSessionInformation: {
        position: '',
        file_name: '',
    },
    interviewSessionList: {
        sessions: [],
        prev_cursor: null,
        next_cursor: null,
        total_pages: 0,
        page_size: 0,
    },
};

export const interviewReducer = (
    state: InterviewState = initialState,
    action: InterviewStateAction,
    ): InterviewState => {
        switch (action.type) {
        case SET_CREATE_INTERVIEW_ERROR:
            return {
            ...state,
            error: action.payload.error,
            };
        case SET_CREATE_INTERVIEW_SUCCESS:
            return {
            ...state,
            success: action.payload.success,
            };
        case SET_CHAT_HISTORY:
            return {
            ...state,
            chatHistory: action.payload.chatHistory,
            };
        case SET_INTERVIEW_SESSION_INFORMATION:
            return {
            ...state,
            interviewSessionInformation: action.payload.interviewSessionInformation,
            };
        case SET_INTERVIEW_SESSION_LIST:
            return {
            ...state,
            interviewSessionList: action.payload.interviewSessionList,
            };
        default:
            return state;
        }
    };
    
    const selectInterview = (state: RootState) => state.interview;
    
    export const interviewSelector = createSelector(
        [selectInterview],
        (interview: InterviewState) => ({
            error: interview.error,
            success: interview.success,
            chatHistory: interview.chatHistory,
            interviewSessionInformation: interview.interviewSessionInformation,
        }),
    );
