import { call, delay, put, take } from 'redux-saga/effects';
import { showSpinner, hideSpinner } from '../components/layout/AppProvider';
import { STORAGE_KEYS } from '../constants';
import { safeNavigate } from '../utils/navigation';
import { ROUTES } from '../constants';
import { HTTP_STATUS } from '../constants';
import { ERROR_MESSAGES } from '../constants';
import type { SagaIterator } from 'redux-saga';
import { GET_EVALUATION_RUBRIC_AND_CRITERIA, GET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID, setEvaluationRubricAndCriteria, setEvaluationRubricAndCriteriaError, setPhraseEvaluationsWithCriteriaBySessionID, setPhraseEvaluationsWithCriteriaBySessionIDError } from '../actions/evaluationAction';
import { apiGetPhraseEvaluationsWithCriteriaBySessionID, apiListAllRubricsAndCriteria } from '../api/evaluationApi';

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
            if (response.statusCode === HTTP_STATUS.UNAUTHORIZED) {
                safeNavigate(ROUTES.SIGN_IN);
                return;
            }
            yield put(setEvaluationRubricAndCriteriaError(response.message));
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield put(setEvaluationRubricAndCriteriaError(message));
    }
}

export function* watcherGetEvaluationRubricAndCriteria(): SagaIterator {
    while (true) {
        yield take(GET_EVALUATION_RUBRIC_AND_CRITERIA);
        yield call(workerGetEvaluationRubricAndCriteria);
    }
}

function* workerGetPhraseEvaluationsWithCriteriaBySessionID(payload: { sessionID: string }): SagaIterator {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiGetPhraseEvaluationsWithCriteriaBySessionID, payload.sessionID, token || '');
        if (response && response.success) {
            yield put(setPhraseEvaluationsWithCriteriaBySessionID(response.data));
        } else {
            if (response.statusCode === HTTP_STATUS.UNAUTHORIZED) {
                safeNavigate(ROUTES.SIGN_IN);
                return;
            }
            yield put(setPhraseEvaluationsWithCriteriaBySessionIDError(response.message));
        }
    }
    catch (error) {
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield put(setPhraseEvaluationsWithCriteriaBySessionIDError(message));
    }
}

export function* watcherGetPhraseEvaluationsWithCriteriaBySessionID(): SagaIterator {
    while (true) {
        const action = yield take(GET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID);
        yield call(workerGetPhraseEvaluationsWithCriteriaBySessionID, action.payload);
    }
}
