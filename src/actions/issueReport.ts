import type { ListUserIssueReportsResp } from "../interface/reportIssueInterface";

export const LIST_ISSUE_REPORTS = 'LIST_ISSUE_REPORTS';
export const SET_LIST_ISSUE_REPORT = 'SET_LIST_ISSUE_REPORT';
export const SET_ISSUE_REPORT_ERROR = 'SET_ISSUE_REPORT_ERROR';

export const listIssueReportsAction = () => {
    return { type: LIST_ISSUE_REPORTS };
};

export const setListIssueReportAction = (response: ListUserIssueReportsResp) => {
    return { type: SET_LIST_ISSUE_REPORT, payload: { listIssueReports: response } };
};

export const setIssueReportErrorAction = (error: string) => {
    return { type: SET_ISSUE_REPORT_ERROR, payload: { error } };
};