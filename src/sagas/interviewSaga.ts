import { call, delay, put, take } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { ERROR_MESSAGES, HTTP_STATUS, ROUTES, STORAGE_KEYS } from "../constants";
import { apiCreateSessionWithNewResume, apiCreateSessionWithExistingResume, apiGetChatHistoryBySessionToken, apiGetInterviewSessionInformation, apiGetInterviewSessionListCursor, apiGetInterviewSessionListPage } from "../api/interviewApi";
import { CREATE_SESSION_WITH_NEW_RESUME, CREATE_SESSION_WITH_EXISTING_RESUME, setCreateInterviewSuccess, GET_CHAT_HISTORY_BY_SESSION_TOKEN, setChatHistory, setInterviewSessionInformation, GET_INTERVIEW_SESSION_INFORMATION, SET_END_INTERVIEW_SESSION_FINISHED, SET_END_INTERVIEW_SESSION_LOADING, GET_INTERVIEW_SESSION_LIST_CURSOR, setInterviewSessionList, GET_INTERVIEW_SESSION_LIST_PAGE } from "../actions/interviewAction";
import { setCreateInterviewError } from "../actions/interviewAction";
import { hideSpinner, safeNavigate, showSpinner, type GetInterviewSessionListCursorReq, type GetInterviewSessionListPageReq } from "..";

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
            safeNavigate(ROUTES.INTERVIEW, { session_token: response.data.session_token });
        } else {
            yield call(hideSpinner);
            if (response) {
                yield call(handleStatusInterviewError, response.statusCode, response.message);
            } else {
                yield call(handleStatusInterviewError, 0, ERROR_MESSAGES.UNEXPECTED_ERROR);
            }
        }
        yield call(hideSpinner);
        safeNavigate(ROUTES.INTERVIEW, { session_token: response.data.session_token });
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
            safeNavigate(ROUTES.INTERVIEW, { session_token: response.data.session_token });
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

export function* watcherCreateSessionWithExistingResume(): SagaIterator {
    while (true) {
        const action = yield take(CREATE_SESSION_WITH_EXISTING_RESUME);
        yield call(workerCreateSessionWithExistingResume, action.payload);
    }
}

function* workerGetChatHistoryBySessionToken(payload: { session_token: string }): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiGetChatHistoryBySessionToken, payload.session_token, token || '');
        console.log("response", response);
        if (response && response.success) {
            yield put(setChatHistory(response.data));
        } else {
            yield call(hideSpinner);
            yield call(handleStatusInterviewError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusInterviewError, 0, message);
    }
}

export function* watcherGetChatHistoryBySessionToken(): SagaIterator {
    while (true) {
        const action = yield take(GET_CHAT_HISTORY_BY_SESSION_TOKEN);
        yield call(workerGetChatHistoryBySessionToken, action.payload);
    }
}

function* workerGetInterviewSessionInformation(payload: { session_token: string }): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiGetInterviewSessionInformation, payload.session_token, token || '');
        console.log("response", response);
        if (response && response.success) {
            yield put(setInterviewSessionInformation(response.data));
        } else {
            yield call(hideSpinner);
            yield call(handleStatusInterviewError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusInterviewError, 0, message);
    }
}

export function* watcherGetInterviewSessionInformation(): SagaIterator {
    while (true) {
        const action = yield take(GET_INTERVIEW_SESSION_INFORMATION);
        yield call(workerGetInterviewSessionInformation, action.payload);
    }
}

export function* handleStatusInterviewError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        safeNavigate(ROUTES.SIGN_IN);
        return;
    }
    yield put(setCreateInterviewError(message));
}

function* workerEndInterviewSessionLoading(): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusInterviewError, 0, message);
    }
}

export function* watcherEndInterviewSessionLoading(): SagaIterator {
    while (true) {
        yield take(SET_END_INTERVIEW_SESSION_LOADING);
        yield call(workerEndInterviewSessionLoading);
    }
}

function* workerEndInterviewSessionFinished(): SagaIterator {
    try {
        yield delay(0);
        yield call(hideSpinner);
        safeNavigate(ROUTES.RECORDINGS);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusInterviewError, 0, message);
    }
}

export function* watcherEndInterviewSessionFinished(): SagaIterator {
    while (true) {
        yield take(SET_END_INTERVIEW_SESSION_FINISHED);
        yield call(workerEndInterviewSessionFinished);
    }
}

function* workerGetInterviewSessionListCursor(payload: GetInterviewSessionListCursorReq): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiGetInterviewSessionListCursor, payload, token || '');
        console.log("response with cursor", response);
        if (response && response.success) {
            yield put(setInterviewSessionList(response.data));
        } else {
            yield call(hideSpinner);
            yield call(handleStatusInterviewError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusInterviewError, 0, message);
    }
}

export function* watcherGetInterviewSessionListCursor(): SagaIterator {
    while (true) {
        const action = yield take(GET_INTERVIEW_SESSION_LIST_CURSOR);
        yield call(workerGetInterviewSessionListCursor, action.payload);
    }
}


function* workerGetInterviewSessionListPage(payload: GetInterviewSessionListPageReq): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiGetInterviewSessionListPage, payload, token || '');
        console.log("response with page", response);
        if (response && response.success) {
            yield put(setInterviewSessionList(response.data));
        } else {
            yield call(hideSpinner);
            yield call(handleStatusInterviewError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusInterviewError, 0, message);
    }
}

export function* watcherGetInterviewSessionListPage(): SagaIterator {
    while (true) {
        const action = yield take(GET_INTERVIEW_SESSION_LIST_PAGE);
        yield call(workerGetInterviewSessionListPage, action.payload);
    }
}