import { call, delay, put} from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { take } from 'redux-saga/effects';
import { FORGOT_PASSWORD, SET_INITIAL_PASSWORD, SIGN_IN_MENTOR, setUserError, SIGN_OUT } from '../actions/userAction';
import { showSpinner, hideSpinner, hideSignOutPopup } from '../components/layout/AppProvider';
import type { UserForgotPasswordRequest, UserSetInitialPasswordRequest, UserSignInRequest } from '../interface/userInterface';
import { apiForgotPassword, apiSetInitialPassword, apiSignInMentor, apiSignOut } from '../api/userApi';
import { safeNavigate } from '../utils/navigation';
import { STORAGE_KEYS, ROUTES, HTTP_STATUS, ERROR_MESSAGES } from '../constants';

function* workerSignInMentor(payload: UserSignInRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiSignInMentor, payload);
        if (response.success) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
            if (response.data.is_temp_password) {
                safeNavigate(ROUTES.SET_INIT_PASSWORD);
            } else {
                safeNavigate(ROUTES.COURSE_LIST);
            }
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

export function* watcherSignInMentor(): SagaIterator {
    while (true) {
        const action = yield take(SIGN_IN_MENTOR);
        yield call(workerSignInMentor, action.payload);
    }
}

function* workerSetInitialPassword(payload: UserSetInitialPasswordRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiSetInitialPassword, payload.password);
        if (response.success) {
            if (response.data.access_token) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
            }
            safeNavigate(ROUTES.COURSE_LIST);
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
    
export function* watcherSetInitialPassword(): SagaIterator {
    while (true) {
        const action = yield take(SET_INITIAL_PASSWORD);
        yield call(workerSetInitialPassword, action.payload);
    }
}

function* workerForgotPassword(payload: UserForgotPasswordRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiForgotPassword, payload);
        if (!response.success) {
            yield call(hideSpinner);
            yield call(handleStatusUserError, response.statusCode, response.message);
            return;
        }
        yield call(hideSpinner);
        return;
    } catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusUserError, 0, message);
    }
}
    
export function* watcherForgotPassword(): SagaIterator {
    while (true) {
        const action = yield take(FORGOT_PASSWORD);
        yield call(workerForgotPassword, action.payload);
    }
}

export function* workerSignOut(): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiSignOut);
        if (response.success) {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            hideSignOutPopup();
            safeNavigate(ROUTES.HOME);
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

export function* handleStatusUserError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        hideSignOutPopup();
        safeNavigate(ROUTES.HOME);
    }
    yield put(setUserError(message));
}
