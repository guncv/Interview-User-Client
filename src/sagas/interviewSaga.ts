import { call, delay, put, take } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { ERROR_MESSAGES, HTTP_STATUS, ROUTES, STORAGE_KEYS } from "../constants";
import { apiCreateSessionWithNewResume } from "../api/interviewApi";
import { safeNavigate } from "../utils/navigation";
import { CREATE_SESSION_WITH_NEW_RESUME, setCreateInterviewSuccess } from "../actions/interviewAction";
import { setCreateInterviewError } from "../actions/interviewAction";
import { hideSpinner, showSpinner } from "..";

function* workerCreateSessionWithNewResume(payload: {
    position: string;
    company: string;
    work_type: string;
    job_requirements: string;
    interview_type: string;
    language: string;
    is_consent: string;
}): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        
        const formData = new FormData();
        formData.append('position', payload.position);
        formData.append('company', payload.company);
        formData.append('work_type', payload.work_type);
        formData.append('job_requirements', payload.job_requirements);
        formData.append('interview_type', payload.interview_type);
        formData.append('language', payload.language);
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

export function* watcherCreateSessionWithNewResume(): SagaIterator {
    while (true) {
        const action = yield take(CREATE_SESSION_WITH_NEW_RESUME);
        yield call(workerCreateSessionWithNewResume, action.payload);
    }
}

export function* handleStatusInterviewError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        safeNavigate(ROUTES.SIGN_IN);
    }
    yield put(setCreateInterviewError(message));
}
