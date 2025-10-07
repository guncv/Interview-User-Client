import type { CreateUserIssueReportReq, ListIssueCategoriesResp } from "../interface/reportIssueInterface";

export const SET_ISSUE_REPORT_ERROR = 'SET_ISSUE_REPORT_ERROR';
export const CREATE_ISSUE_REPORT = 'CREATE_ISSUE_REPORT';
export const LIST_ISSUE_CATEGORIES = 'LIST_ISSUE_CATEGORIES';
export const SET_LIST_ISSUE_CATEGORY = 'SET_LIST_ISSUE_CATEGORY';
export const SET_LIST_ISSUE_CATEGORY_LOADING = 'SET_LIST_ISSUE_CATEGORY_LOADING';
export const SET_LIST_ISSUE_CATEGORY_ERROR = 'SET_LIST_ISSUE_CATEGORY_ERROR';

export const setIssueReportErrorAction = (error: string) => {
    return { type: SET_ISSUE_REPORT_ERROR, payload: { error } };
};

export const createIssueReportAction = (request: CreateUserIssueReportReq) => {
    return { type: CREATE_ISSUE_REPORT, payload: request };
};

export const listIssueCategoriesAction = () => {
    return { type: LIST_ISSUE_CATEGORIES };
};

export const setListIssueCategoryAction = (response: ListIssueCategoriesResp) => {
    return { type: SET_LIST_ISSUE_CATEGORY, payload: { listIssueCategories: response } };
};

export const setListIssueCategoryLoadingAction = (loading: boolean) => {
    return { type: SET_LIST_ISSUE_CATEGORY_LOADING, payload: { listIssueCategoriesLoading: loading } };
};

export const setListIssueCategoryErrorAction = (error: string) => {
    return { type: SET_LIST_ISSUE_CATEGORY_ERROR, payload: { listIssueCategoriesError: error } };
};