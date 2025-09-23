import type { AxiosError } from "axios";
import { API_ENDPOINTS, CONTENT_TYPES, HTTP_HEADERS } from "../constants";
import { axiosInstance } from "./axiosInstance";
import { handleApiError } from "./errorApi";
import type { CreateInterviewSessionResponse, CreateInterviewSessionWithExistingResumeRequest, GetChatHistoryBySessionTokenResp, GetInterviewSessionInformationResp, GetInterviewSessionListResp, GetInterviewSessionListCursorReq, GetInterviewSessionListPageReq } from "../interface/interviewInterface";

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

export const apiGetChatHistoryBySessionToken = async (session_token: string, token: string) => {
    try {
        const response = await axiosInstance.get(
            `${API_ENDPOINTS.GET_CHAT_HISTORY_BY_SESSION_TOKEN}/${session_token}`,
            {
                headers: {
                    [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
                    [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                },
            }
        );

        return { success: true, data: response.data as GetChatHistoryBySessionTokenResp };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiGetInterviewSessionInformation = async (session_token: string, token: string) => {
    try {
        const response = await axiosInstance.get(
                `${API_ENDPOINTS.GET_INTERVIEW_SESSION_INFORMATION}/${session_token}`,
            {
                headers: {
                    [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
                    [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                },
            }
        );

        return { success: true, data: response.data as GetInterviewSessionInformationResp };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiGetInterviewSessionListCursor = async (payload: GetInterviewSessionListCursorReq, token: string) => {
    console.log("Get interview session list cursor token ", token);
    try {
        const filteredParams = Object.entries(payload).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                const queryKey = key;
                acc[queryKey] = value;
            }
            return acc;
        }, {} as Record<string, any>);

        const response = await axiosInstance.get(
            API_ENDPOINTS.LIST_INTERVIEW_SESSIONS_CURSOR,
            {
                params: filteredParams,
                headers: {
                    [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
                    [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                },
            }
        );
        return { success: true, data: response.data as GetInterviewSessionListResp };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiGetInterviewSessionListPage = async (payload: GetInterviewSessionListPageReq, token: string) => {
    try {
        const filteredParams = Object.entries(payload).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                const queryKey = key;
                acc[queryKey] = value;
            }
            return acc;
        }, {} as Record<string, any>);

        const response = await axiosInstance.get(
            API_ENDPOINTS.LIST_INTERVIEW_SESSIONS_PAGE,
            {
                params: filteredParams,
                headers: {
                    [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
                    [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                },
            }
        );
        return { success: true, data: response.data as GetInterviewSessionListResp };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiDeleteInterviewSessionById = async (payload: string, token: string) => {
    try {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_INTERVIEW_SESSION_BY_ID}/${payload}`,
            {
                headers: {
                    [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
                    [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                },
            }
        );
        return { success: true, data: response.data as GetInterviewSessionListResp };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};