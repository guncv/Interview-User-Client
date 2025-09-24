import { createSelector } from '@reduxjs/toolkit';
import {
    SET_CREATE_INTERVIEW_ERROR,
    SET_CREATE_INTERVIEW_SUCCESS,
    SET_CHAT_HISTORY,
    SET_INTERVIEW_SESSION_INFORMATION_BY_ID,
    SET_INTERVIEW_SESSION_LIST,
    SET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION,
    ADD_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION,
} from '../actions/interviewAction';
import type { RootState } from './rootReducer';
import type { CreateInterviewSessionResponse, GetChatHistoryBySessionIDWithEvaluationResp, GetChatHistoryBySessionTokenResp, GetInterviewSessionInformationResp, GetInterviewSessionListResp } from '../interface/interviewInterface';

type InterviewState = {
    error: string;
    success: CreateInterviewSessionResponse;
    chatHistory: GetChatHistoryBySessionTokenResp;
    interviewSessionInformationById: GetInterviewSessionInformationResp;
    interviewSessionList: GetInterviewSessionListResp;
    chatHistoryBySessionIDWithEvaluation: GetChatHistoryBySessionIDWithEvaluationResp;
}
type InterviewStateAction = {
    type: string;
    payload: {
        error: string;
        success: CreateInterviewSessionResponse;
        chatHistory: GetChatHistoryBySessionTokenResp;
        interviewSessionInformationById: GetInterviewSessionInformationResp;
        interviewSessionList: GetInterviewSessionListResp;
        chatHistoryBySessionIDWithEvaluation: GetChatHistoryBySessionIDWithEvaluationResp;
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
        created_at_full_name: '',
    },
    interviewSessionList: {
        sessions: [],
        prev_cursor: null,
        next_cursor: null,
        total_pages: 0,
        page_size: 0,
    },
    chatHistoryBySessionIDWithEvaluation: {
        chat_history: [],
        cursor_turn_next: 0,
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
        case SET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION:
            return {
            ...state,
            chatHistoryBySessionIDWithEvaluation: action.payload.chatHistoryBySessionIDWithEvaluation,
            };
        case ADD_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION:
            return {
            ...state,
            chatHistoryBySessionIDWithEvaluation: {
                ...state.chatHistoryBySessionIDWithEvaluation,
                chat_history: [
                    ...state.chatHistoryBySessionIDWithEvaluation.chat_history,
                    ...action.payload.chatHistoryBySessionIDWithEvaluation.chat_history,
                ],
                cursor_turn_next: action.payload.chatHistoryBySessionIDWithEvaluation.cursor_turn_next,
            },
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
            chatHistoryBySessionIDWithEvaluation: interview.chatHistoryBySessionIDWithEvaluation,
        }),
    );
