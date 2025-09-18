import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './rootReducer';
import type { ListUserIssueReportsResp } from '../interface/reportIssueInterface';
import { SET_ISSUE_REPORT_ERROR, SET_LIST_ISSUE_REPORT } from '../actions/issueReport';

type IssueReportState = {
    error: string;
    listIssueReports: ListUserIssueReportsResp;
}

type IssueReportStateAction = {
    type: string;
    payload: {
        error: string;
        listIssueReports: ListUserIssueReportsResp;
    }
}

const initialState: IssueReportState = {
    error: '',
    listIssueReports: {
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
        }),
    );
