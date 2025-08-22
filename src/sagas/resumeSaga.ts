import type { SagaIterator } from "redux-saga";
import { call, delay, put, take } from "redux-saga/effects";
import { handleStatusUserError } from "./userSaga";
import type { ListResumeRequest } from "../interface/resumeInterface";
import { apiGetResumeById, apiListResume } from "../api/resumeApi";
import { hideSpinner, showSpinner } from "../components/layout/AppProvider";
import { ERROR_MESSAGES, STORAGE_KEYS } from "../constants";
import { LIST_RESUME, setResumeSuccess, GET_RESUME_BY_ID, setResumeByIdSuccess } from "../actions/resumeAction";

function* workerListResume(payload: ListResumeRequest): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiListResume, payload, token || '');
        
        if (response && !response.success) {
            yield call(handleStatusUserError, response.statusCode, response.message);
        }
        
        if (response && response.success) {
            yield put(setResumeSuccess(response.data));
        } else {
            yield call(hideSpinner);
            if (response) {
                yield call(handleStatusUserError, response.statusCode, response.message);
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

function* workerGetResumeById(payload: { id: string }): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiGetResumeById, payload.id, token || '');
        
        if (response && !response.success) {
            yield call(handleStatusUserError, response.statusCode, response.message);
        }
        
        if (response && response.success) {
            yield put(setResumeByIdSuccess(response.data));
        } else {
            yield call(hideSpinner);
            if (response) {
                yield call(handleStatusUserError, response.statusCode, response.message);
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

export function* watcherGetResumeById(): SagaIterator {
    while (true) {
        const action = yield take(GET_RESUME_BY_ID);
        yield call(workerGetResumeById, action.payload);
    }
}



