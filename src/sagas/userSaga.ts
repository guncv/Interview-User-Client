import { call, delay, put, take } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { setUserError, SIGN_OUT, GET_GOOGLE_AUTH_URL, HANDLE_GOOGLE_CALLBACK, GET_FACEBOOK_AUTH_URL, HANDLE_FACEBOOK_CALLBACK } from '../actions/userAction';
import { showSpinner, hideSpinner} from '../components/layout/AppProvider';
import type { GoogleCallbackRequest, FacebookCallbackRequest } from '../interface/userInterface';
import { apiSignOut, apiGetGoogleAuthURL, apiHandleGoogleCallback, apiGetFacebookAuthURL, apiHandleFacebookCallback } from '../api/userApi';
import { safeNavigate } from '../utils/navigation';
import { STORAGE_KEYS, ROUTES, HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export function* workerSignOut(): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiSignOut);
        if (response.success) {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            safeNavigate(ROUTES.SIGN_IN);
        } else {
            yield call(hideSpinner);
            yield call(handleStatusUserError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
        return;
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusUserError, 0, message);
    }
}

export function* watcherSignOut(): SagaIterator {
    while (true) {
        yield take(SIGN_OUT);
        yield call(workerSignOut);
    }
}

function* workerGetGoogleAuthURL(): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiGetGoogleAuthURL);
        if (response.success) {
            window.location.href = response.data.auth_url;
        } else {
            yield call(hideSpinner);
            yield call(handleStatusUserError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusUserError, 0, message);
    }
}

export function* watcherGetGoogleAuthURL(): SagaIterator {
    while (true) {
        yield take(GET_GOOGLE_AUTH_URL);
        yield call(workerGetGoogleAuthURL);
    }
}

function* workerHandleGoogleCallback(payload: GoogleCallbackRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiHandleGoogleCallback, payload);
        if (response.success) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
            safeNavigate(ROUTES.RECORDINGS);
        } else {
            yield call(hideSpinner);
            yield call(handleStatusUserError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusUserError, 0, message);
    }
}

export function* watcherHandleGoogleCallback(): SagaIterator {
    while (true) {
        const action = yield take(HANDLE_GOOGLE_CALLBACK);
        yield call(workerHandleGoogleCallback, action.payload);
    }
}

function* workerGetFacebookAuthURL(): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiGetFacebookAuthURL);
        if (response.success) {
            window.location.href = response.data.auth_url;
        } else {
            yield call(hideSpinner);
            yield call(handleStatusUserError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusUserError, 0, message);
    }
}

export function* watcherGetFacebookAuthURL(): SagaIterator {
    while (true) {
        yield take(GET_FACEBOOK_AUTH_URL);
        yield call(workerGetFacebookAuthURL);
    }
}

function* workerHandleFacebookCallback(payload: FacebookCallbackRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiHandleFacebookCallback, payload);
        if (response.success) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
            safeNavigate(ROUTES.RECORDINGS);
        } else {
            yield call(hideSpinner);
            yield call(handleStatusUserError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusUserError, 0, message);
    }
}

export function* watcherHandleFacebookCallback(): SagaIterator {
    while (true) {
        const action = yield take(HANDLE_FACEBOOK_CALLBACK);
        yield call(workerHandleFacebookCallback, action.payload);
    }
}

export function* handleStatusUserError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        safeNavigate(ROUTES.SIGN_IN);
        return;
    }
    yield put(setUserError(message));
}
