import { all } from 'redux-saga/effects';
import { watcherForgotPassword, watcherSignOut, watcherSignIn, watcherVerifyEmail, watcherSignUp, watcherResetVerifyEmail, watcherResetPassword } from './userSaga';
import { watcherGetResumeById, watcherListResume, watcherDownloadResumeBySessionToken } from './resumeSaga';
import { watcherCreateSessionWithNewResume, watcherCreateSessionWithExistingResume, watcherGetChatHistoryBySessionToken, watcherGetInterviewSessionInformation } from './interviewSaga';

export default function* rootSaga() {
    yield all([
        watcherSignIn(),
        watcherForgotPassword(),
        watcherSignOut(),
        watcherSignUp(),
        watcherVerifyEmail(),
        watcherResetVerifyEmail(),
        watcherResetPassword(),
        watcherListResume(),
        watcherGetResumeById(),
        watcherCreateSessionWithNewResume(),
        watcherCreateSessionWithExistingResume(),
        watcherGetChatHistoryBySessionToken(),
        watcherGetInterviewSessionInformation(),
        watcherDownloadResumeBySessionToken(),
    ]);
}

