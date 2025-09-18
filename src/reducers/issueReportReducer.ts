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

// Mock data for testing UI
const mockIssueReports = [
    {
        id: '1',
        description: 'The video quality during interview sessions is often pixelated and unclear, making it difficult to maintain professional communication.',
        category_id: 'tech-001',
        category_name: 'Technical Issues',
        is_editable: true,
        acknowledged: false,
        comment_count: 3,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T14:45:00Z',
    },
    {
        id: '2',
        description: 'Audio feedback and echo issues occur frequently during mock interviews, disrupting the flow of conversation.',
        category_id: 'tech-001',
        category_name: 'Technical Issues',
        is_editable: false,
        acknowledged: true,
        comment_count: 1,
        created_at: '2024-01-14T09:15:00Z',
        updated_at: '2024-01-14T16:20:00Z',
    },
    {
        id: '3',
        description: 'The interview scheduling system sometimes double-books sessions, causing conflicts and confusion.',
        category_id: 'sched-002',
        category_name: 'Scheduling',
        is_editable: true,
        acknowledged: false,
        comment_count: 5,
        created_at: '2024-01-13T11:00:00Z',
        updated_at: '2024-01-13T18:30:00Z',
    },
    {
        id: '4',
        description: 'Resume upload feature fails when PDF files exceed 2MB, even though the limit should be 5MB.',
        category_id: 'feat-003',
        category_name: 'Feature Request',
        is_editable: true,
        acknowledged: true,
        comment_count: 2,
        created_at: '2024-01-12T14:20:00Z',
        updated_at: '2024-01-12T17:45:00Z',
    },
    {
        id: '5',
        description: 'The AI interviewer sometimes asks irrelevant questions that don\'t match the job position selected.',
        category_id: 'ai-004',
        category_name: 'AI Performance',
        is_editable: false,
        acknowledged: false,
        comment_count: 8,
        created_at: '2024-01-11T08:45:00Z',
        updated_at: '2024-01-11T12:15:00Z',
    },
    {
        id: '6',
        description: 'Login session expires too quickly, forcing users to re-authenticate multiple times during a single interview.',
        category_id: 'auth-005',
        category_name: 'Authentication',
        is_editable: true,
        acknowledged: true,
        comment_count: 0,
        created_at: '2024-01-10T16:30:00Z',
        updated_at: '2024-01-10T16:30:00Z',
    },
    {
        id: '7',
        description: 'The feedback report generation is slow and sometimes fails to include all interview segments.',
        category_id: 'perf-006',
        category_name: 'Performance',
        is_editable: true,
        acknowledged: false,
        comment_count: 4,
        created_at: '2024-01-09T13:10:00Z',
        updated_at: '2024-01-09T19:25:00Z',
    },
    {
        id: '8',
        description: 'Mobile app crashes when trying to access interview history on iOS devices.',
        category_id: 'mobile-007',
        category_name: 'Mobile Issues',
        is_editable: false,
        acknowledged: true,
        comment_count: 6,
        created_at: '2024-01-08T10:15:00Z',
        updated_at: '2024-01-08T15:40:00Z',
    },
    {
        id: '9',
        description: 'Need ability to pause and resume interviews when technical issues occur during the session.',
        category_id: 'feat-003',
        category_name: 'Feature Request',
        is_editable: true,
        acknowledged: false,
        comment_count: 12,
        created_at: '2024-01-07T12:45:00Z',
        updated_at: '2024-01-07T20:10:00Z',
    },
    {
        id: '10',
        description: 'Email notifications for scheduled interviews are not being sent consistently.',
        category_id: 'notif-008',
        category_name: 'Notifications',
        is_editable: true,
        acknowledged: true,
        comment_count: 2,
        created_at: '2024-01-06T09:30:00Z',
        updated_at: '2024-01-06T14:55:00Z',
    },
    {
        id: '11',
        description: 'Screen sharing feature during technical interviews doesn\'t work properly on Firefox browser.',
        category_id: 'tech-001',
        category_name: 'Technical Issues',
        is_editable: false,
        acknowledged: false,
        comment_count: 1,
        created_at: '2024-01-05T15:20:00Z',
        updated_at: '2024-01-05T15:20:00Z',
    },
    {
        id: '12',
        description: 'Interview recordings are missing audio in the first 30 seconds of each session.',
        category_id: 'record-009',
        category_name: 'Recording Issues',
        is_editable: true,
        acknowledged: true,
        comment_count: 7,
        created_at: '2024-01-04T11:15:00Z',
        updated_at: '2024-01-04T17:30:00Z',
    },
    {
        id: '13',
        description: 'The practice mode should have more diverse question banks for different industries.',
        category_id: 'feat-003',
        category_name: 'Feature Request',
        is_editable: true,
        acknowledged: false,
        comment_count: 9,
        created_at: '2024-01-03T14:40:00Z',
        updated_at: '2024-01-03T21:05:00Z',
    },
    {
        id: '14',
        description: 'User profile pictures are not displaying correctly after being uploaded.',
        category_id: 'ui-010',
        category_name: 'UI/UX Issues',
        is_editable: true,
        acknowledged: true,
        comment_count: 3,
        created_at: '2024-01-02T10:25:00Z',
        updated_at: '2024-01-02T16:45:00Z',
    },
    {
        id: '15',
        description: 'Dashboard loading times are extremely slow during peak hours (9 AM - 11 AM).',
        category_id: 'perf-006',
        category_name: 'Performance',
        is_editable: false,
        acknowledged: false,
        comment_count: 15,
        created_at: '2024-01-01T08:50:00Z',
        updated_at: '2024-01-01T13:20:00Z',
    },
    {
        id: '16',
        description: 'Need integration with popular calendar apps like Google Calendar and Outlook for better scheduling.',
        category_id: 'integ-011',
        category_name: 'Integration',
        is_editable: true,
        acknowledged: true,
        comment_count: 11,
        created_at: '2023-12-31T16:15:00Z',
        updated_at: '2023-12-31T22:40:00Z',
    },
    {
        id: '17',
        description: 'The AI interviewer\'s speech recognition doesn\'t work well with non-native English accents.',
        category_id: 'ai-004',
        category_name: 'AI Performance',
        is_editable: true,
        acknowledged: false,
        comment_count: 6,
        created_at: '2023-12-30T12:30:00Z',
        updated_at: '2023-12-30T18:15:00Z',
    },
    {
        id: '18',
        description: 'Password reset emails are going to spam folder instead of inbox.',
        category_id: 'auth-005',
        category_name: 'Authentication',
        is_editable: false,
        acknowledged: true,
        comment_count: 4,
        created_at: '2023-12-29T09:45:00Z',
        updated_at: '2023-12-29T15:10:00Z',
    },
    {
        id: '19',
        description: 'Interview feedback scores seem inconsistent and don\'t align with actual performance quality.',
        category_id: 'ai-004',
        category_name: 'AI Performance',
        is_editable: true,
        acknowledged: false,
        comment_count: 13,
        created_at: '2023-12-28T13:55:00Z',
        updated_at: '2023-12-28T19:30:00Z',
    },
    {
        id: '20',
        description: 'Need dark mode option for better user experience during evening interview sessions.',
        category_id: 'feat-003',
        category_name: 'Feature Request',
        is_editable: true,
        acknowledged: true,
        comment_count: 8,
        created_at: '2023-12-27T17:20:00Z',
        updated_at: '2023-12-27T23:45:00Z',
    },
];

const initialState: IssueReportState = {
    error: '',
    listIssueReports: {
        data: mockIssueReports,
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
