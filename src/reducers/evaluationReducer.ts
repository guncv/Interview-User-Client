import { createSelector } from '@reduxjs/toolkit';
import {
    SET_EVALUATION_RUBRIC_AND_CRITERIA,
    SET_EVALUATION_RUBRIC_AND_CRITERIA_ERROR,
    SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID,
    SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID_ERROR,
} from '../actions/evaluationAction';
import type { RootState } from './rootReducer';
import type { GetPhraseEvaluationsWithCriteriaResp, ListAllRubricsAndCriteriaResp } from '../interface/evaluationInterface';

type EvaluationState = {
    evaluationRubricAndCriteriaError: string;
    evaluationRubricAndCriteria: ListAllRubricsAndCriteriaResp;
    phraseEvaluationsWithCriteriaBySessionID: GetPhraseEvaluationsWithCriteriaResp;
    phraseEvaluationsWithCriteriaBySessionIDError: string;
    phraseEvaluationsWithCriteriaBySessionIDLoading: boolean;
}
type EvaluationStateAction = {
    type: string;
    payload: {
        evaluationRubricAndCriteriaError: string;
        evaluationRubricAndCriteria: ListAllRubricsAndCriteriaResp;
        phraseEvaluationsWithCriteriaBySessionIDError: string;
        phraseEvaluationsWithCriteriaBySessionID: GetPhraseEvaluationsWithCriteriaResp;
        phraseEvaluationsWithCriteriaBySessionIDLoading: boolean;
    }
}
const initialState: EvaluationState = {
    evaluationRubricAndCriteria: {
        rubrics: [],
    },
    phraseEvaluationsWithCriteriaBySessionID: {
        phrase_evaluations: [],
    },
    phraseEvaluationsWithCriteriaBySessionIDLoading: true,
    evaluationRubricAndCriteriaError: '',
    phraseEvaluationsWithCriteriaBySessionIDError: '',
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
            evaluationRubricAndCriteriaError: action.payload.evaluationRubricAndCriteriaError,
            };
        case SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID:
            return {
            ...state,
            phraseEvaluationsWithCriteriaBySessionID: action.payload.phraseEvaluationsWithCriteriaBySessionID,
            phraseEvaluationsWithCriteriaBySessionIDLoading: false,
            };
        case SET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID_ERROR:
            return {
            ...state,
            phraseEvaluationsWithCriteriaBySessionIDError: action.payload.phraseEvaluationsWithCriteriaBySessionIDError,
            phraseEvaluationsWithCriteriaBySessionIDLoading: false,
            };
        default:
            return state;
        }
    };
    
    const selectEvaluation = (state: RootState) => state.evaluation;
    
    export const evaluationSelector = createSelector(
        [selectEvaluation],
        (evaluation: EvaluationState) => ({
            evaluationRubricAndCriteriaError: evaluation.evaluationRubricAndCriteriaError,
            phraseEvaluationsWithCriteriaBySessionIDError: evaluation.phraseEvaluationsWithCriteriaBySessionIDError,
            phraseEvaluationsWithCriteriaBySessionID: evaluation.phraseEvaluationsWithCriteriaBySessionID,
            phraseEvaluationsWithCriteriaBySessionIDLoading: evaluation.phraseEvaluationsWithCriteriaBySessionIDLoading,
            evaluationRubricAndCriteria: evaluation.evaluationRubricAndCriteria,
        }),
    );
