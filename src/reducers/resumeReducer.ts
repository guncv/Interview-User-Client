import { createSelector } from '@reduxjs/toolkit';
import {
    SET_RESUME_ERROR,
    SET_RESUME_SUCCESS,
} from '../actions/resumeAction';
import type { RootState } from './rootReducer';
import type { ResumeResponse } from '../interface/resumeInterface';

type ResumeState = {
    error: string;
    success: ResumeResponse;
}
type ResumeStateAction = {
    type: string;
    payload: {
        error: string;
        success: ResumeResponse;
    }
}
const initialState: ResumeState = {
    error: '',
    success: {
        count: 0,
        resume_content: null,
        last_updated_at: null,
    },
};

export const resumeReducer = (
    state: ResumeState = initialState,
    action: ResumeStateAction,
    ): ResumeState => {
        switch (action.type) {
        case SET_RESUME_ERROR:
            return {
            ...state,
            error: action.payload.error,
            };
        case SET_RESUME_SUCCESS:
            return {
            ...state,
            success: action.payload.success,
            };
        default:
            return state;
        }
    };
    
    const selectResume = (state: RootState) => state.resume;
    
    export const resumeSelector = createSelector(
        [selectResume],
        (resume: ResumeState) => ({
            error: resume.error,
            success: resume.success,
        }),
    );
