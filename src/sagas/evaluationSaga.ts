import { call, delay, put, take } from 'redux-saga/effects';
import { showSpinner, hideSpinner } from '../components/layout/AppProvider';
import { STORAGE_KEYS } from '../constants';
import { safeNavigate } from '../utils/navigation';
import { ROUTES } from '../constants';
import { HTTP_STATUS } from '../constants';
import { ERROR_MESSAGES } from '../constants';
import type { SagaIterator } from 'redux-saga';
import { GET_EVALUATION_RUBRIC_AND_CRITERIA, setEvaluationRubricAndCriteria, setEvaluationRubricAndCriteriaError } from '../actions/evaluationAction';
import { apiListAllRubricsAndCriteria } from '../api/evaluationApi';

function* workerGetEvaluationRubricAndCriteria(): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiListAllRubricsAndCriteria, token || '');
        if (response && response.success) {
            yield put(setEvaluationRubricAndCriteria(response.data));
        } else {
            yield call(hideSpinner);
            yield call(handleStatusEvaluationError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusEvaluationError, 0, message);
    }
}

export function* watcherGetEvaluationRubricAndCriteria(): SagaIterator {
    while (true) {
        yield take(GET_EVALUATION_RUBRIC_AND_CRITERIA);
        yield call(workerGetEvaluationRubricAndCriteria);
    }
}

export function* handleStatusEvaluationError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        safeNavigate(ROUTES.SIGN_IN);
        return;
    }
    yield put(setEvaluationRubricAndCriteriaError(message));
}