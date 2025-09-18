import type { ListUserIssueReportsResp, CreateUserIssueReportReq, UpdateUserIssueReportByIDReq, ListIssueCategoriesResp, UserIssueReport } from "../interface/reportIssueInterface";

export const LIST_ISSUE_REPORTS = 'LIST_ISSUE_REPORTS';
export const SET_LIST_ISSUE_REPORT = 'SET_LIST_ISSUE_REPORT';
export const SET_ISSUE_REPORT_ERROR = 'SET_ISSUE_REPORT_ERROR';
export const CREATE_ISSUE_REPORT = 'CREATE_ISSUE_REPORT';
export const UPDATE_ISSUE_REPORT = 'UPDATE_ISSUE_REPORT';
export const ADD_ISSUE_REPORT = 'ADD_ISSUE_REPORT';
export const UPDATE_ISSUE_REPORT_IN_LIST = 'UPDATE_ISSUE_REPORT_IN_LIST';
export const LIST_ISSUE_CATEGORIES = 'LIST_ISSUE_CATEGORIES';
export const SET_LIST_ISSUE_CATEGORY = 'SET_LIST_ISSUE_CATEGORY';

export const listIssueReportsAction = () => {
    return { type: LIST_ISSUE_REPORTS };
};

export const setListIssueReportAction = (response: ListUserIssueReportsResp) => {
    return { type: SET_LIST_ISSUE_REPORT, payload: { listIssueReports: response } };
};

export const setIssueReportErrorAction = (error: string) => {
    return { type: SET_ISSUE_REPORT_ERROR, payload: { error } };
};

export const createIssueReportAction = (request: CreateUserIssueReportReq) => {
    return { type: CREATE_ISSUE_REPORT, payload: request };
};

export const updateIssueReportAction = (id: string, request: UpdateUserIssueReportByIDReq) => {
    return { type: UPDATE_ISSUE_REPORT, payload: { id, request } };
};

export const listIssueCategoriesAction = () => {
    return { type: LIST_ISSUE_CATEGORIES };
};

export const setListIssueCategoryAction = (response: ListIssueCategoriesResp) => {
    return { type: SET_LIST_ISSUE_CATEGORY, payload: { listIssueCategories: response } };
};

export const addIssueReportAction = (issueReport: UserIssueReport) => {
    return { type: ADD_ISSUE_REPORT, payload: { issueReport } };
};

export const updateIssueReportInListAction = (issueReport: UserIssueReport) => {
    return { type: UPDATE_ISSUE_REPORT_IN_LIST, payload: { issueReport } };
};