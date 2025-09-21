import type { SagaIterator } from "redux-saga";
import { call, delay, put, take } from "redux-saga/effects";
import { hideSpinner, showSpinner } from "../components/layout/AppProvider";
import { ERROR_MESSAGES, HTTP_STATUS, STORAGE_KEYS } from "../constants";
import { apiCreateIssueReport, apiListIssueCategories } from "../api/issueReportApi";
import { safeNavigate } from "../utils/navigation";
import { ROUTES } from "../constants";
import { setIssueReportErrorAction, setListIssueCategoryAction, LIST_ISSUE_CATEGORIES, CREATE_ISSUE_REPORT } from "../actions/issueReport";
import type { CreateUserIssueReportReq } from "../interface/reportIssueInterface";

function* workerCreateIssueReport(payload: CreateUserIssueReportReq): SagaIterator {
    try {
        console.log("workerCreateIssueReport", payload);
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiCreateIssueReport, token || '', payload);

        if (response && response.success) {
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

export function* watcherCreateIssueReport(): SagaIterator {
    while (true) {
        const action = yield take(CREATE_ISSUE_REPORT);
        yield call(workerCreateIssueReport, action.payload);
    }
}

function* workerListIssueCategories(): SagaIterator {
    try {
        yield delay(0);
        yield call(showSpinner);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = yield call(apiListIssueCategories, token || '');

        if (response && response.success) {
            yield put(setListIssueCategoryAction(response.data));
        } else {
            yield put(setListIssueCategoryAction({ data: [] }));
            yield call(hideSpinner);
            yield call(handleStatusIssueReportError, response.statusCode, response.message);
        }
        yield call(hideSpinner);
    }
    catch (error) {
        yield put(setListIssueCategoryAction({ data: [] }));
        yield call(hideSpinner);
        const message = (error as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        yield call(handleStatusIssueReportError, 0, message);
    }
}

export function* watcherListIssueCategories(): SagaIterator {
    while (true) {
        yield take(LIST_ISSUE_CATEGORIES);
        yield call(workerListIssueCategories);
    }
}

export function* handleStatusIssueReportError(statusCode: number, message: string) {
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
        safeNavigate(ROUTES.SIGN_IN);
        return;
    }
    yield put(setIssueReportErrorAction(message));
}
