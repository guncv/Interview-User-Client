import { API_ENDPOINTS, HTTP_HEADERS } from "../constants";
import { axiosInstance } from "./axiosInstance";
import { handleApiError } from "./errorApi";
import type { AxiosError } from "axios";
import type { CreateUserIssueReportReq, UpdateUserIssueReportByIDReq } from "../interface/reportIssueInterface";

export const apiListIssueReports = async (token: string) => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.LIST_ISSUE_REPORTS}`, {
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
            },
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiCreateIssueReport = async (token: string, request: CreateUserIssueReportReq) => {
    try {
        console.log("apiCreateIssueReport", request);
        const response = await axiosInstance.post(`${API_ENDPOINTS.CREATE_ISSUE_REPORT}`, request, {
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                [HTTP_HEADERS.CONTENT_TYPE]: 'application/json',
            },
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiUpdateIssueReport = async (token: string, id: string, request: UpdateUserIssueReportByIDReq) => {
    try {
        const response = await axiosInstance.patch(`${API_ENDPOINTS.UPDATE_ISSUE_REPORT}/${id}`, request, {
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                [HTTP_HEADERS.CONTENT_TYPE]: 'application/json',
            },
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiListIssueCategories = async (token: string) => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.LIST_ISSUE_CATEGORIES}`, {
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
            },
        });
        console.log('response.data', response.data);
        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};