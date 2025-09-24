import { all } from 'redux-saga/effects';
import { watcherForgotPassword, watcherSignOut, watcherSignIn, watcherVerifyEmail, watcherSignUp, watcherResetVerifyEmail, watcherResetPassword } from './userSaga';
import { watcherGetResumeById, watcherListResume, watcherDownloadResumeBySessionToken } from './resumeSaga';
import { watcherCreateSessionWithNewResume, watcherCreateSessionWithExistingResume, watcherGetChatHistoryBySessionToken, watcherEndInterviewSessionLoading, watcherEndInterviewSessionFinished, watcherGetInterviewSessionListCursor, watcherGetInterviewSessionListPage, watcherDeleteInterviewSessionById, watcherGetInterviewSessionInformationById, watcherGetChatHistoryBySessionIDWithEvaluation } from './interviewSaga';
import { watcherListIssueCategories, watcherCreateIssueReport } from './issueReport';
import { watcherCreateReviewComment } from './reviewCommentSaga';
import { watcherGetEvaluationRubricAndCriteria } from './evaluationSaga';

export default function* rootSaga() {
    yield all([
        // ===== USER AUTHENTICATION MODULE =====
        watcherSignIn(),
        watcherForgotPassword(),
        watcherSignOut(),
        watcherSignUp(),
        watcherVerifyEmail(),
        watcherResetVerifyEmail(),
        watcherResetPassword(),
        
        // ===== RESUME MANAGEMENT MODULE =====
        watcherListResume(),
        watcherGetResumeById(),
        watcherDownloadResumeBySessionToken(),
        
        // ===== INTERVIEW SIMULATION MODULE =====
        watcherCreateSessionWithNewResume(),
        watcherCreateSessionWithExistingResume(),
        watcherGetChatHistoryBySessionToken(),
        watcherEndInterviewSessionLoading(),
        watcherEndInterviewSessionFinished(),
        watcherGetInterviewSessionListCursor(),
        watcherGetInterviewSessionListPage(),
        watcherDeleteInterviewSessionById(),
        watcherGetInterviewSessionInformationById(),
        watcherGetChatHistoryBySessionIDWithEvaluation(),
        
        // ===== EVALUATION MODULE =====
        watcherGetEvaluationRubricAndCriteria(),
        
        // ===== ISSUE REPORTING MODULE =====
        watcherListIssueCategories(),
        watcherCreateIssueReport(),

        // ===== REVIEW COMMENT MODULE =====
        watcherCreateReviewComment(),
    ]);
}

