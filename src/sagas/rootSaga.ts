import { all } from 'redux-saga/effects';
import { watcherForgotPassword, watcherSignOut, watcherSignIn, watcherVerifyEmail, watcherSignUp, watcherResetVerifyEmail, watcherResetPassword } from './userSaga';
import { watcherGetResumeById, watcherListResume } from './resumeSaga';

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
    ]);
}

