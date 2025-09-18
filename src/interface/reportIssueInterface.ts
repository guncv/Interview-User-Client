export interface ListUserIssueReportsResp {
	data: UserIssueReport[];
}

export interface UserIssueReport {
	id:             string;
	description:    string;
	category_id:     string;
	category_name:   string;
	is_editable:     boolean;
	acknowledged:   boolean;
	comment_count:   number;
	created_at:      string;
	updated_at:      string;
}

export interface CreateUserIssueReportReq {
	description: string;
	category_id: string;
}

export interface UpdateUserIssueReportByIDReq {
	description: string;
	category_id: string;
}

export interface ListIssueCategoriesResp {
	data: IssueCategory[];
}

export interface IssueCategory {
	id: string;
	name: string;
}