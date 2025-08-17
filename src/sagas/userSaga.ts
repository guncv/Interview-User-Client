import { call, delay, put} from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { take } from 'redux-saga/effects';
import { FORGOT_PASSWORD, SIGN_IN, setUserError, SIGN_OUT, SIGN_UP, VERIFY_EMAIL, RESET_VERIFY_EMAIL, RESET_PASSWORD } from '../actions/userAction';
import { showSpinner, hideSpinner, hideSignOutPopup } from '../components/layout/AppProvider';
import type { UserForgotPasswordRequest, UserSignInRequest, UserSignUpRequest, UserVerifyEmailRequest } from '../interface/userInterface';
import { apiForgotPassword, apiResetPassword, apiResetVerifyEmail, apiSignIn, apiSignOut, apiSignUp, apiVerifyEmail } from '../api/userApi';
import { safeNavigate } from '../utils/navigation';
import { STORAGE_KEYS, ROUTES, HTTP_STATUS, ERROR_MESSAGES } from '../constants';

function* workerSignUp(payload: UserSignUpRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiSignUp, payload);
        if (response.success) {
            safeNavigate(ROUTES.VERIFY_EMAIL, { token: response.data.token_id });
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

export function* watcherSignUp(): SagaIterator {
    while (true) {
        const action = yield take(SIGN_UP);
        yield call(workerSignUp, action.payload);
    }
}

function* workerResetVerifyEmail(payload: any): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiResetVerifyEmail, payload.token);
        if (response.success) {
            safeNavigate(ROUTES.VERIFY_EMAIL, { token: response.data.token_id });
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

export function* watcherResetVerifyEmail(): SagaIterator {
    while (true) {
        const action = yield take(RESET_VERIFY_EMAIL);
        yield call(workerResetVerifyEmail, action.payload);
    }
}

function* workerResetPassword(payload: any): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiResetPassword, payload.token, payload.password);
        if (response.success) {
            safeNavigate(ROUTES.RESET_PASSWORD_SUCCESS);
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

export function* watcherResetPassword(): SagaIterator {
    while (true) {
        const action = yield take(RESET_PASSWORD);
        yield call(workerResetPassword, action.payload);
    }
}

function* workerSignIn(payload: UserSignInRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiSignIn, payload);
        if (response.success) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
            safeNavigate(ROUTES.SIGN_IN);
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

export function* watcherSignIn(): SagaIterator {
    while (true) {
        const action = yield take(SIGN_IN);
        yield call(workerSignIn, action.payload);
    }
}

function* workerVerifyEmail(payload: UserVerifyEmailRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const response = yield call(apiVerifyEmail, payload);
        if (response.success) {
            safeNavigate(ROUTES.SIGN_IN);
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

export function* watcherVerifyEmail(): SagaIterator {
    while (true) {
        const action = yield take(VERIFY_EMAIL);
        yield call(workerVerifyEmail, action.payload);
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

export function* handleStatusUserError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        hideSignOutPopup();
        safeNavigate(ROUTES.SIGN_IN);
    }
    yield put(setUserError(message));
}
