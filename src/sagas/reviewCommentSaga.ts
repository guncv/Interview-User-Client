import type { SagaIterator } from "redux-saga";
import { call, delay, put, take } from "redux-saga/effects";
import { hideSpinner, showSpinner } from "../components/layout/AppProvider";
import { ERROR_MESSAGES, HTTP_STATUS, ROUTES, STORAGE_KEYS } from "../constants";
import { apiCreateReviewComment } from "../api/reviewCommentApi";
import { setReviewCommentError, setAlreadyReviewComment, CREATE_REVIEW_COMMENT } from "../actions/reviewCommenAction";
import type { CreateReviewCommentRequest } from "../interface/reviewCommentInterface";
import { safeNavigate } from "../utils/navigation";

function* workerCreateReviewComment(payload: CreateReviewCommentRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiCreateReviewComment, payload, token || '');
        if (response && response.success) {
            yield call(handleStatusReviewCommentError, response.statusCode, "");
            yield put(setAlreadyReviewComment(true));
        } else {
            yield call(hideSpinner);
            yield call(handleStatusReviewCommentError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusReviewCommentError, 0, message);
    }
}

export function* watcherCreateReviewComment(): SagaIterator {
    while (true) {
        const action = yield take(CREATE_REVIEW_COMMENT);
        yield call(workerCreateReviewComment, action.payload);
    }
}

export function* handleStatusReviewCommentError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        safeNavigate(ROUTES.SIGN_IN);
        return;
    }
    yield put(setReviewCommentError(message));
}