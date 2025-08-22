import type { AxiosError } from "axios";
import { API_ENDPOINTS } from "../constants";
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
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return { success: true, data: response.data as CreateInterviewSessionResponse };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiCreateSessionWithExistingResume = async (data: CreateInterviewSessionWithExistingResumeRequest) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.CREATE_SESSION_WITH_EXISTING_RESUME, data);

        return { success: true, data: response.data as CreateInterviewSessionResponse };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};