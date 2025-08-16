import { all } from 'redux-saga/effects';
import { watcherSetInitialPassword, watcherForgotPassword, watcherSignOut, watcherSignIn } from './userSaga';

export default function* rootSaga() {
    yield all([
        watcherSignIn(),
        watcherSetInitialPassword(),
        watcherForgotPassword(),
        watcherSignOut(),
    ]);
}

