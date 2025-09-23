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
