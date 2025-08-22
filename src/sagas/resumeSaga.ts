import type { SagaIterator } from "redux-saga";
import { call, delay, put, take } from "redux-saga/effects";
import { handleStatusUserError } from "./userSaga";
import type { ListResumeRequest } from "../interface/resumeInterface";
import { apiListResume } from "../api/resumeApi";
import { hideSpinner, showSpinner } from "../components/layout/AppProvider";
import { ERROR_MESSAGES, STORAGE_KEYS, ROUTES } from "../constants";
import { LIST_RESUME, setResumeSuccess } from "../actions/resumeAction";
import { SIGN_OUT } from "../actions/userAction";
import { callWithTokenRefresh, isTokenError, isRefreshTokenError, handleAuthError } from "../utils/apiUtils";

function* handleInvalidTokens(): SagaIterator {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    yield put({ type: SIGN_OUT });
    window.location.href = ROUTES.SIGN_IN;
}

function* workerListResume(payload: ListResumeRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        
        const response = yield call(callWithTokenRefresh, apiListResume, payload);
        
        if (response && !response.success) {
            if (isRefreshTokenError(response.code)) {
                // Force sign in for refresh token errors
                handleAuthError(response.code);
                return;
            } else if (isTokenError(response.code)) {
                // Handle other token errors
                yield call(handleInvalidTokens);
                return;
            }
        }
        
        if (response && response.success) {
            yield put(setResumeSuccess(response.data));
        } else {
            yield call(hideSpinner);
            if (response) {
                yield call(handleStatusUserError, response.statusCode, response.message, response.code);
            } else {
                yield call(handleStatusUserError, 0, ERROR_MESSAGES.UNEXPECTED_ERROR);
            }
        }
        yield call(hideSpinner);
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusUserError, 0, message);
    }
}

export function* watcherListResume(): SagaIterator {
    while (true) {
        const action = yield take(LIST_RESUME);
        yield call(workerListResume, action.payload);
    }
}
