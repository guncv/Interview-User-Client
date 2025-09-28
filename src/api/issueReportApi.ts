import { API_ENDPOINTS, HTTP_HEADERS } from "../constants";
import { axiosInstance } from "./axiosInstance";
import { handleApiError } from "./errorApi";
import type { AxiosError } from "axios";
import type { CreateUserIssueReportReq } from "../interface/reportIssueInterface";

export const apiCreateIssueReport = async (token: string, request: CreateUserIssueReportReq) => {
    try {
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

export const apiListIssueCategories = async (token: string) => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.LIST_ISSUE_CATEGORIES}`, {
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