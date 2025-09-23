import type { ListAllRubricsAndCriteriaResp } from "../interface/evaluationInterface";

export const GET_EVALUATION_RUBRIC_AND_CRITERIA = 'GET_EVALUATION_RUBRIC_AND_CRITERIA';
export const SET_EVALUATION_RUBRIC_AND_CRITERIA = 'SET_EVALUATION_RUBRIC_AND_CRITERIA';
export const SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR = 'SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR';

export const getEvaluationRubricAndCriteria = () => {
    return { type: GET_EVALUATION_RUBRIC_AND_CRITERIA};
};

export const setEvaluationRubricAndCriteria = (evaluationRubricAndCriteria: ListAllRubricsAndCriteriaResp) => {
    return { type: SET_EVALUATION_RUBRIC_AND_CRITERIA, payload: {evaluationRubricAndCriteria } };
};

export const setEvaluationRubricAndCriteriaError = (error: string) => {
    return { type: SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR, payload: error };
};