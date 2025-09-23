import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './rootReducer';
import { SET_REVIEW_COMMENT_ERROR,SET_ALREADY_REVIEW_COMMENT } from '../actions/reviewCommenAction';

type ReviewCommentState = {
    error: string;
    alreadyFeedback: boolean;
}

type ReviewCommentStateAction = {
    type: string;
    payload: {
        error: string;
        alreadyFeedback: boolean;
    }
}

const initialState: ReviewCommentState = {
    error: '',
    alreadyFeedback: false,
};

export const reviewCommentReducer = (
    state: ReviewCommentState = initialState,
    action: ReviewCommentStateAction,
    ): ReviewCommentState => {
        switch (action.type) {
        case SET_REVIEW_COMMENT_ERROR:
            return {
            ...state,
            error: action.payload.error,
            };
        case SET_ALREADY_REVIEW_COMMENT:
            return {
            ...state,
            alreadyFeedback: action.payload.alreadyFeedback,
            };
        default:
            return state;
        }
    };
    
    const selectReviewComment = (state: RootState) => state.reviewComment;
    
    export const reviewCommentSelector = createSelector(
        [selectReviewComment],
        (reviewComment: ReviewCommentState) => ({
            error: reviewComment.error,
            alreadyFeedback: reviewComment.alreadyFeedback,
        }),
    );
