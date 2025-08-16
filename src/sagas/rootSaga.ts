import { all } from 'redux-saga/effects';
import { watcherSignInMentor, watcherSetInitialPassword, watcherForgotPassword, watcherSignOut } from './userSaga';

export default function* rootSaga() {
    yield all([
        watcherSignInMentor(),
        watcherSetInitialPassword(),
        watcherForgotPassword(),
        watcherSignOut(),
    ]);
}

