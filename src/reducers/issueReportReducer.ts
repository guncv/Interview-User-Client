import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './rootReducer';
import type { ListIssueCategoriesResp, UserIssueReport } from '../interface/reportIssueInterface';
import { SET_ISSUE_REPORT_ERROR, SET_LIST_ISSUE_CATEGORY } from '../actions/issueReport';

type IssueReportState = {
    error: string;
    listIssueCategories: ListIssueCategoriesResp;
}

type IssueReportStateAction = {
    type: string;
    payload: {
        error: string;
        listIssueCategories: ListIssueCategoriesResp;
        issueReport: UserIssueReport;
    }
}

const initialState: IssueReportState = {
    error: '',
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
        case SET_LIST_ISSUE_CATEGORY:
            return {
            ...state,
            listIssueCategories: action.payload.listIssueCategories,
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
        }),
    );
