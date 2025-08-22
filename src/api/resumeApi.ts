import { config } from "../../env";
import { API_ENDPOINTS, HTTP_HEADERS } from "../constants";
import { axiosInstance } from "./axiosInstance";
import { handleApiError } from "./errorApi";
import type { AxiosError } from "axios";
import type { ListResumeRequest } from "../interface/resumeInterface";

export const apiListResume = async (payload: ListResumeRequest, token: string) => {
    try {
        const response = await axiosInstance.get(`${config.Domain}${API_ENDPOINTS.LIST_RESUME}`, {
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${token}`,
            },
            params: payload,
        });

        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};