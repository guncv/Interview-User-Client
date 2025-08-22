import { createSelector } from '@reduxjs/toolkit';
import {
    SET_CREATE_INTERVIEW_ERROR,
    SET_CREATE_INTERVIEW_SUCCESS,
} from '../actions/interviewAction';
import type { RootState } from './rootReducer';
import type { CreateInterviewSessionResponse } from '../interface/interviewInterface';

type InterviewState = {
    error: string;
    success: CreateInterviewSessionResponse;
}
type InterviewStateAction = {
    type: string;
    payload: {
        error: string;
        success: CreateInterviewSessionResponse;
    }
}
const initialState: InterviewState = {
    error: '',
    success: {
        session_token: '',
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
        }),
    );
