import type { SagaIterator } from "redux-saga";
import { call, delay, put, take } from "redux-saga/effects";
import { hideSpinner, showSpinner } from "../components/layout/AppProvider";
import { ERROR_MESSAGES, HTTP_STATUS, STORAGE_KEYS } from "../constants";
import { apiListIssueReports } from "../api/issueReportApi";
import { safeNavigate } from "../utils/navigation";
import { ROUTES } from "../constants";
import { LIST_ISSUE_REPORTS, setListIssueReportAction, setIssueReportErrorAction } from "../actions/issueReport";

function* workerListIssueReports(): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiListIssueReports, token || '');

        if (response && response.success) {
            yield put(setListIssueReportAction(response.data));
        } else {
            yield call(hideSpinner);
            yield call(handleStatusIssueReportError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusIssueReportError, 0, message);
    }
}

export function* watcherListIssueReports(): SagaIterator {
    while (true) {
        yield take(LIST_ISSUE_REPORTS);
        yield call(workerListIssueReports);
    }
}

export function* handleStatusIssueReportError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        safeNavigate(ROUTES.SIGN_IN);
        return;
    }
    yield put(setIssueReportErrorAction(message));
}
