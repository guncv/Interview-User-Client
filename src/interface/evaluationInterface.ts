export interface ListAllRubricsAndCriteriaResp {
	rubrics: RubricAndCriteriaRow[];
}

export interface RubricAndCriteriaRow {
    id: string;
	name: string;
	description_md: string;
	criteria: CriterionRow[];
}

export interface CriterionRow {
	id: string;
	name: string;
	description_md: string;
	percentage: string;
	color: string;
}


export interface GetPhraseEvaluationsWithCriteriaResp {
	phrase_evaluations: PhraseEvaluations[];
}

export interface PhraseEvaluations {
	state_id: string;
	state_name: string;
	overall_score: number;
	max_score: number;
	overall_color: string;
	criteria: PhraseEvaluationCriteria[];
}

export interface PhraseEvaluationCriteria {
	criteria_id: string;
	criteria_name: string;
	criteria_score: number;
	max_score: number;
	criteria_color: string;
	criteria_comment: string;
}