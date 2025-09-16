import { call, delay, put, take } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { ERROR_MESSAGES, HTTP_STATUS, ROUTES, STORAGE_KEYS } from "../constants";
import { apiCreateSessionWithNewResume, apiCreateSessionWithExistingResume } from "../api/interviewApi";
import { CREATE_SESSION_WITH_NEW_RESUME, CREATE_SESSION_WITH_EXISTING_RESUME, setCreateInterviewSuccess } from "../actions/interviewAction";
import { setCreateInterviewError } from "../actions/interviewAction";
import { hideSpinner, safeNavigate, showSpinner } from "..";

function* workerCreateSessionWithNewResume(payload: {
    position: string;
    is_consent: string;
}): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        
        const formData = new FormData();
        formData.append('position', payload.position);
        formData.append('is_consent', payload.is_consent);
        
        const response = yield call(apiCreateSessionWithNewResume, formData);
        
        if (response && response.success) {
            yield put(setCreateInterviewSuccess(response.data));
        } else {
            yield call(hideSpinner);
            if (response) {
                yield call(handleStatusInterviewError, response.statusCode, response.message);
            } else {
                yield call(handleStatusInterviewError, 0, ERROR_MESSAGES.UNEXPECTED_ERROR);
            }
        }
        yield call(hideSpinner);
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusInterviewError, 0, message);
    }
}

function* workerCreateSessionWithExistingResume(payload: {
    resume_id: string;
    position: string;
    is_consent: boolean;
}): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiCreateSessionWithExistingResume, payload, token || '');
        
        if (response && response.success) {
            yield put(setCreateInterviewSuccess(response.data));
        } else {
            yield call(hideSpinner);
            if (response) {
                yield call(handleStatusInterviewError, response.statusCode, response.message);
            } else {
                yield call(handleStatusInterviewError, 0, ERROR_MESSAGES.UNEXPECTED_ERROR);
            }
        }
        yield call(hideSpinner);
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusInterviewError, 0, message);
    }
}

export function* watcherCreateSessionWithNewResume(): SagaIterator {
    while (true) {
        const action = yield take(CREATE_SESSION_WITH_NEW_RESUME);
        yield call(workerCreateSessionWithNewResume, action.payload);
    }
}

export function* watcherCreateSessionWithExistingResume(): SagaIterator {
    while (true) {
        const action = yield take(CREATE_SESSION_WITH_EXISTING_RESUME);
        yield call(workerCreateSessionWithExistingResume, action.payload);
    }
}

export function* handleStatusInterviewError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        safeNavigate(ROUTES.SIGN_IN);
        return;
    }
    yield put(setCreateInterviewError(message));
}
