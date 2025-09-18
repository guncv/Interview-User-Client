import { API_ENDPOINTS, HTTP_HEADERS } from "../constants";
import { axiosInstance } from "./axiosInstance";
import { handleApiError } from "./errorApi";
import type { AxiosError } from "axios";

export const apiListIssueReports = async (token: string) => {
    try {
        
        const response = await axiosInstance.get(`${API_ENDPOINTS.LIST_ISSUE_REPORTS}`, {
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
            },
        });

        console.log("response from list issue reports", response.data);

        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
}