import { createSelector } from '@reduxjs/toolkit';
import {
    SET_EVALUATION_RUBRIC_AND_CRITERIA,
    SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR,
} from '../actions/evaluationAction';
import type { RootState } from './rootReducer';
import type { ListAllRubricsAndCriteriaResp } from '../interface/evaluationInterface';

type EvaluationState = {
    error: string;
    evaluationRubricAndCriteria: ListAllRubricsAndCriteriaResp;
}
type EvaluationStateAction = {
    type: string;
    payload: {
        error: string;
        evaluationRubricAndCriteria: ListAllRubricsAndCriteriaResp;
    }
}
const initialState: EvaluationState = {
    evaluationRubricAndCriteria: {
        rubrics: [],
    },
    error: '',
};

export const evaluationReducer = (
    state: EvaluationState = initialState,
    action: EvaluationStateAction,
    ): EvaluationState => {
        switch (action.type) {
        case SET_EVALUATION_RUBRIC_AND_CRITERIA:
            return {
            ...state,
            evaluationRubricAndCriteria: action.payload.evaluationRubricAndCriteria,
            };
        case SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR:
            return {
            ...state,
            error: action.payload.error,
            };
        default:
            return state;
        }
    };
    
    const selectEvaluation = (state: RootState) => state.evaluation;
    
    export const evaluationSelector = createSelector(
        [selectEvaluation],
        (evaluation: EvaluationState) => ({
            error: evaluation.error,
            evaluationRubricAndCriteria: evaluation.evaluationRubricAndCriteria,
        }),
    );
