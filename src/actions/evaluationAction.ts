import type { GetPhraseEvaluationsWithCriteriaResp, ListAllRubricsAndCriteriaResp } from "../interface/evaluationInterface";

export const GET_EVALUATION_RUBRIC_AND_CRITERIA = 'GET_EVALUATION_RUBRIC_AND_CRITERIA';
export const SET_EVALUATION_RUBRIC_AND_CRITERIA = 'SET_EVALUATION_RUBRIC_AND_CRITERIA';
export const SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR = 'SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR';
export const GET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID = 'GET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID';
export const SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID = 'SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID';
export const SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID_ERROR = 'SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID_ERROR';
export const GET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID_LOADING = 'GET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID_LOADING';

export const getEvaluationRubricAndCriteria = () => {
    return { type: GET_EVALUATION_RUBRIC_AND_CRITERIA};
};

export const setEvaluationRubricAndCriteria = (evaluationRubricAndCriteria: ListAllRubricsAndCriteriaResp) => {
    return { type: SET_EVALUATION_RUBRIC_AND_CRITERIA, payload: {evaluationRubricAndCriteria } };
};

export const setEvaluationRubricAndCriteriaError = (error: string) => {
    return { type: SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR, payload: error };
};

export const getPhraseEvaluationsWithCriteriaBySessionID = (sessionID: string) => {
    return { type: GET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID, payload: { sessionID } };
};

export const setPhraseEvaluationsWithCriteriaBySessionID = (phraseEvaluationsWithCriteriaBySessionID: GetPhraseEvaluationsWithCriteriaResp) => {
    return { type: SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID, payload: { phraseEvaluationsWithCriteriaBySessionID } };
};

export const setPhraseEvaluationsWithCriteriaBySessionIDError = (error: string) => {
    return { type: SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID_ERROR, payload: error };
};

