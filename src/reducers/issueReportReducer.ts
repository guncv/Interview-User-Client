import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './rootReducer';
import type { ListIssueCategoriesResp, UserIssueReport } from '../interface/reportIssueInterface';
import { SET_ISSUE_REPORT_ERROR, SET_LIST_ISSUE_CATEGORY, SET_LIST_ISSUE_CATEGORY_LOADING, SET_LIST_ISSUE_CATEGORY_ERROR } from '../actions/issueReport';

type IssueReportState = {
    error: string;
    listIssueCategories: ListIssueCategoriesResp;
    listIssueCategoriesLoading: boolean;
    listIssueCategoriesError: string;
}

type IssueReportStateAction = {
    type: string;
    payload: {
        error: string;
        listIssueCategories: ListIssueCategoriesResp;
        issueReport: UserIssueReport;
        listIssueCategoriesLoading: boolean;
        listIssueCategoriesError: string;
    }
}

const initialState: IssueReportState = {
    error: '',
    listIssueCategories: {
        data: [],
    },
    listIssueCategoriesLoading: false,
    listIssueCategoriesError: '',
};

export const issueReportReducer = (
    state: IssueReportState = initialState,
    action: IssueReportStateAction,
    ): IssueReportState => {
        switch (action.type) {
        case SET_ISSUE_REPORT_ERROR:
            return {
            ...state,
            error: action.payload.error,
            };
        case SET_LIST_ISSUE_CATEGORY:
            return {
            ...state,
            listIssueCategories: action.payload.listIssueCategories,
            listIssueCategoriesLoading: false,
            listIssueCategoriesError: '',
            };
        case SET_LIST_ISSUE_CATEGORY_LOADING:
            return {
            ...state,
            listIssueCategoriesLoading: action.payload.listIssueCategoriesLoading,
            };
        case SET_LIST_ISSUE_CATEGORY_ERROR:
            return {
            ...state,
            listIssueCategoriesError: action.payload.listIssueCategoriesError,
            listIssueCategoriesLoading: false,
            };
        default:
            return state;
        }
    };
    
    const selectIssueReport = (state: RootState) => state.issueReport;
    
    export const issueReportSelector = createSelector(
        [selectIssueReport],
        (issueReport: IssueReportState) => ({
            error: issueReport.error,
            listIssueCategories: issueReport.listIssueCategories,
            listIssueCategoriesLoading: issueReport.listIssueCategoriesLoading,
            listIssueCategoriesError: issueReport.listIssueCategoriesError,
        }),
    );
