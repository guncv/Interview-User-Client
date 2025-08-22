import { createSelector } from '@reduxjs/toolkit';
import {
    SET_RESUME_ERROR,
    SET_RESUME_SUCCESS,
    SET_RESUME_BY_ID_SUCCESS,
} from '../actions/resumeAction';
import type { RootState } from './rootReducer';
import type { GetResumeByIdResponse, ResumeResponse } from '../interface/resumeInterface';

type ResumeState = {
    error: string;
    success: ResumeResponse;
    resumeById: GetResumeByIdResponse;
}
type ResumeStateAction = {
    type: string;
    payload: {
        error: string;
        success: ResumeResponse;
        resumeById: GetResumeByIdResponse;
    }
}
const initialState: ResumeState = {
    error: '',
    success: {
        count: 0,
        resume_content: null,
        last_updated_at: null,
    },
    resumeById: {
        id: '',
        fileName: '',
        mimeType: '',
        byteSize: 0,
        fileUrl: '',
        createdAt: '',
        updatedAt: '',
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
        case SET_RESUME_BY_ID_SUCCESS:
            return {
            ...state,
            resumeById: action.payload.resumeById,
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
            resumeById: resume.resumeById,
        }),
    );
