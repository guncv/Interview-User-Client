import type { CreateReviewCommentRequest } from "../interface/reviewCommentInterface";

export const SET_REVIEW_COMMENT_ERROR = 'SET_REVIEW_COMMENT_ERROR';
export const SET_ALREADY_REVIEW_COMMENT = 'SET_ALREADY_REVIEW_COMMENT';
export const CREATE_REVIEW_COMMENT = 'CREATE_REVIEW_COMMENT';

export const setReviewCommentError = (message: string) => {
    return { type: SET_REVIEW_COMMENT_ERROR, payload: { error: message } };
};

export const setAlreadyReviewComment = (payload: boolean) => {
    return { type: SET_ALREADY_REVIEW_COMMENT, payload: { alreadyFeedback: payload } };
};

export const createReviewComment = (payload: CreateReviewCommentRequest) => {
    return { type: CREATE_REVIEW_COMMENT, payload };
};