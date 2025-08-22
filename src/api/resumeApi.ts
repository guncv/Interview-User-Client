import { API_ENDPOINTS, HTTP_HEADERS } from "../constants";
import { axiosInstance } from "./axiosInstance";
import { handleApiError } from "./errorApi";
import type { AxiosError } from "axios";
import type { ListResumeRequest } from "../interface/resumeInterface";

export const apiListResume = async (payload: ListResumeRequest, token: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.LIST_RESUME, {
            params: payload,
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

export const apiGetResumeById = async (id: string, token: string) => {
    try {
        
        const response = await axiosInstance.get(`${API_ENDPOINTS.GET_RESUME_BY_ID}/${id}`, {
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
            },
        });

        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
} 