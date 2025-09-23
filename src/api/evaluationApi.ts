import { API_ENDPOINTS, CONTENT_TYPES, HTTP_HEADERS } from "../constants";
import type { ListAllRubricsAndCriteriaResp } from "../interface/evaluationInterface";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "./errorApi";
import type { AxiosError } from "axios";

export const apiListAllRubricsAndCriteria = async (token: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.LIST_ALL_RUBRICS_AND_CRITERIA,{
            headers: {
                [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
                [HTTP_HEADERS.AUTHORIZATION]: `${HTTP_HEADERS.BEARER} ${token}`,
            },
            }
        );

        return { success: true, data: response.data as ListAllRubricsAndCriteriaResp };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};
