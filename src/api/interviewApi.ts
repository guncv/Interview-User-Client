import type { AxiosError } from "axios";
import { API_ENDPOINTS, CONTENT_TYPES, HTTP_HEADERS } from "../constants";
import { axiosInstance } from "./axiosInstance";
import { handleApiError } from "./errorApi";
import type { CreateInterviewSessionResponse, CreateInterviewSessionWithExistingResumeRequest } from "../interface/interviewInterface";

export const apiCreateSessionWithNewResume = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(
            API_ENDPOINTS.CREATE_SESSION_WITH_NEW_RESUME,
            data,
            {
                headers: {
                    [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.MULTIPART_FORM_DATA,
                },
            }
        );

        return { success: true, data: response.data as CreateInterviewSessionResponse };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiCreateSessionWithExistingResume = async (data: CreateInterviewSessionWithExistingResumeRequest, token: string) => {
    try {
        const response = await axiosInstance.post(
            API_ENDPOINTS.CREATE_SESSION_WITH_EXISTING_RESUME,
            data,
            {
                headers: {
                    [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
                    [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                },
            }
        );

        return { success: true, data: response.data as CreateInterviewSessionResponse };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};