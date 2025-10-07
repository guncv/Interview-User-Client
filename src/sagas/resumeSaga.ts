import type { SagaIterator } from "redux-saga";
import { call, delay, put, take } from "redux-saga/effects";
import { handleStatusUserError } from "./userSaga";
import type { ListResumeRequest } from "../interface/resumeInterface";
import { apiDownloadResumeByResumeId, apiGetResumeById, apiListResume } from "../api/resumeApi";
import { hideSpinner, showSpinner } from "../components/layout/AppProvider";
import { ERROR_MESSAGES, STORAGE_KEYS } from "../constants";
import { LIST_RESUME, setResumeSuccess, GET_RESUME_BY_ID, setResumeByIdSuccess, DOWNLOAD_RESUME_BY_RESUME_ID } from "../actions/resumeAction";

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

function* workerDownloadResumeByResumeId(payload: { resume_id: string }): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiDownloadResumeByResumeId, payload.resume_id, token || '');
        
        if (response && !response.success) {
            yield call(handleStatusUserError, response.statusCode, response.message);
        }
        
        if (response && response.success) {
            try {
                const fileResponse = yield call(fetch, response.data.file_url);
                
                if (!fileResponse.ok) {
                    throw new Error(`HTTP error! status: ${fileResponse.status}`);
                }
        
                const blob = yield call([fileResponse, 'blob']);
                const blobUrl = URL.createObjectURL(blob);
        
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = response.data.file_name || 'resume.pdf';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
        
                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl);
                }, 1000);
            } catch (error) {
                const fallback = document.createElement('a');
                fallback.href = response.data.file_url;
                fallback.download = response.data.file_name;
                fallback.target = '_blank';
                document.body.appendChild(fallback);
                fallback.click();
                document.body.removeChild(fallback);
            }
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

export function* watcherDownloadResumeBySessionToken(): SagaIterator {
    while (true) {
        const action = yield take(DOWNLOAD_RESUME_BY_RESUME_ID);
        yield call(workerDownloadResumeByResumeId, action.payload);
    }
}





