import { createSelector } from '@reduxjs/toolkit';
import {
    SET_CREATE_INTERVIEW_ERROR,
    SET_CREATE_INTERVIEW_SUCCESS,
    SET_CHAT_HISTORY,
    SET_INTERVIEW_SESSION_INFORMATION_BY_ID,
    SET_INTERVIEW_SESSION_LIST,
} from '../actions/interviewAction';
import type { RootState } from './rootReducer';
import type { CreateInterviewSessionResponse, GetChatHistoryBySessionTokenResp, GetInterviewSessionInformationResp, GetInterviewSessionListResp } from '../interface/interviewInterface';

type InterviewState = {
    error: string;
    success: CreateInterviewSessionResponse;
    chatHistory: GetChatHistoryBySessionTokenResp;
    interviewSessionInformationById: GetInterviewSessionInformationResp;
    interviewSessionList: GetInterviewSessionListResp;
}
type InterviewStateAction = {
    type: string;
    payload: {
        error: string;
        success: CreateInterviewSessionResponse;
        chatHistory: GetChatHistoryBySessionTokenResp;
        interviewSessionInformationById: GetInterviewSessionInformationResp;
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
    interviewSessionInformationById: {
        resume_id: '',
        resume_file_name: '',
        position: '',
        status: '',
        status_display_name: '',
        status_color: '',
        overall_score_percent: '',
        overall_score_color: '',
        started_at: '',
        ended_at: '',
        overall_score: 0,
        summary_md: '',
        created_at: '',
        created_at_display: '',
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
        case SET_INTERVIEW_SESSION_INFORMATION_BY_ID:
            return {
            ...state,
            interviewSessionInformationById: action.payload.interviewSessionInformationById,
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
            interviewSessionInformationById: interview.interviewSessionInformationById,
        }),
    );
