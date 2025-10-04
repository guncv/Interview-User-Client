import { createSelector } from '@reduxjs/toolkit';
import {
    SET_CREATE_INTERVIEW_ERROR,
    SET_CREATE_INTERVIEW_SUCCESS,
    SET_CHAT_HISTORY,
    SET_INTERVIEW_SESSION_INFORMATION_BY_ID,
    SET_INTERVIEW_SESSION_LIST,
    SET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION,
    ADD_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION,
    SET_LOAD_MORE_CHAT_HISTORY_LOADING,
    ADD_CHAT_HISTORY,
    SET_LOAD_MORE_CHAT_HISTORY_BY_SESSION_TOKEN_LOADING,
} from '../actions/interviewAction';
import type { RootState } from './rootReducer';
import type { CreateInterviewSessionResponse, GetChatHistoryBySessionIDWithEvaluationResp, GetChatHistoryBySessionTokenResp, GetInterviewSessionInformationResp, GetInterviewSessionListResp } from '../interface/interviewInterface';

type InterviewState = {
    error: string;
    success: CreateInterviewSessionResponse;
    chatHistory: GetChatHistoryBySessionTokenResp;
    chatHistoryLoading: boolean;
    loadMoreChatHistoryBySessionTokenLoading: boolean;
    interviewSessionInformationById: GetInterviewSessionInformationResp;
    interviewSessionList: GetInterviewSessionListResp;
    chatHistoryBySessionIDWithEvaluation: GetChatHistoryBySessionIDWithEvaluationResp;
    chatHistoryBySessionIDWithEvaluationLoading: boolean;
    loadMoreChatHistoryLoading: boolean;
}
type InterviewStateAction = {
    type: string;
    payload: {
        error: string;
        success: CreateInterviewSessionResponse;
        chatHistory: GetChatHistoryBySessionTokenResp;
        chatHistoryLoading: boolean;
        loadMoreChatHistoryBySessionTokenLoading: boolean;
        interviewSessionInformationById: GetInterviewSessionInformationResp;
        interviewSessionList: GetInterviewSessionListResp;
        chatHistoryBySessionIDWithEvaluation: GetChatHistoryBySessionIDWithEvaluationResp;
        chatHistoryBySessionIDWithEvaluationLoading: boolean;
        isLoading: boolean;
    }
}
const initialState: InterviewState = {
    error: '',
    success: {
        session_token: '',
    },
    chatHistory: {
        chat_history: [],
        cursor_turn_next: 0,
    },
    chatHistoryLoading: true,
    loadMoreChatHistoryBySessionTokenLoading: false,
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
        total_time: '',
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
    chatHistoryBySessionIDWithEvaluationLoading: true,
    loadMoreChatHistoryLoading: false,
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
        case SET_LOAD_MORE_CHAT_HISTORY_BY_SESSION_TOKEN_LOADING:
            return {
            ...state,
            loadMoreChatHistoryBySessionTokenLoading: action.payload.isLoading,
            };
        case SET_CHAT_HISTORY:
            return {
                ...state,
                chatHistory: action.payload.chatHistory,
                chatHistoryLoading: false,
            };
        case ADD_CHAT_HISTORY:
            return {
                ...state,
                chatHistory: {
                    ...state.chatHistory,
                    chat_history: [
                        ...action.payload.chatHistory.chat_history,
                        ...state.chatHistory.chat_history,
                    ],
                    cursor_turn_next: action.payload.chatHistory.cursor_turn_next,
                },
                loadMoreChatHistoryBySessionTokenLoading: false,
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
            chatHistoryBySessionIDWithEvaluationLoading: false,
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
            loadMoreChatHistoryLoading: false,
            };
        case SET_LOAD_MORE_CHAT_HISTORY_LOADING:
            return {
            ...state,
            loadMoreChatHistoryLoading: action.payload.isLoading,
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
            chatHistoryLoading: interview.chatHistoryLoading,
            loadMoreChatHistoryBySessionTokenLoading: interview.loadMoreChatHistoryBySessionTokenLoading,
            interviewSessionInformationById: interview.interviewSessionInformationById,
            chatHistoryBySessionIDWithEvaluation: interview.chatHistoryBySessionIDWithEvaluation,
        }),
    );
