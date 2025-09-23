import type { AxiosError } from "axios";
import { API_ENDPOINTS, CONTENT_TYPES, HTTP_HEADERS } from "../constants";
import type { CreateReviewCommentRequest } from "../interface/reviewCommentInterface";
import { axiosInstance } from "./axiosInstance";
import { handleApiError } from "./errorApi";

export const apiCreateReviewComment = async (payload: CreateReviewCommentRequest, token: string) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.CREATE_REVIEW_COMMENT, payload,
            {
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
                [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
            },
            });

        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};