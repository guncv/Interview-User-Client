import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './rootReducer';
import type { ListUserIssueReportsResp, ListIssueCategoriesResp, UserIssueReport } from '../interface/reportIssueInterface';
import { SET_ISSUE_REPORT_ERROR, SET_LIST_ISSUE_CATEGORY, SET_LIST_ISSUE_REPORT, ADD_ISSUE_REPORT, UPDATE_ISSUE_REPORT_IN_LIST } from '../actions/issueReport';

type IssueReportState = {
    error: string;
    listIssueReports: ListUserIssueReportsResp;
    listIssueCategories: ListIssueCategoriesResp;
}

type IssueReportStateAction = {
    type: string;
    payload: {
        error: string;
        listIssueReports: ListUserIssueReportsResp;
        listIssueCategories: ListIssueCategoriesResp;
        issueReport: UserIssueReport;
    }
}

const initialState: IssueReportState = {
    error: '',
    listIssueReports: {
        data: [],
    },
    listIssueCategories: {
        data: [],
    },
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
        case SET_LIST_ISSUE_REPORT:
            return {
            ...state,
            listIssueReports: action.payload.listIssueReports,
            };
        case SET_LIST_ISSUE_CATEGORY:
            return {
            ...state,
            listIssueCategories: action.payload.listIssueCategories,
            };
        case ADD_ISSUE_REPORT:
            return {
            ...state,
            listIssueReports: {
                ...state.listIssueReports,
                data: [action.payload.issueReport, ...state.listIssueReports.data],
            },
            };
        case UPDATE_ISSUE_REPORT_IN_LIST:
            return {
            ...state,
            listIssueReports: {
                ...state.listIssueReports,
                data: state.listIssueReports.data.map(issue =>
                    issue.id === action.payload.issueReport.id
                        ? action.payload.issueReport
                        : issue
                ),
            },
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
            listIssueReports: issueReport.listIssueReports,
            listIssueCategories: issueReport.listIssueCategories,
        }),
    );
