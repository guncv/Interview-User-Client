import { AxiosError } from 'axios';
import type { GoogleAuthURLResponse, GoogleCallbackRequest, GoogleCallbackResponse } from '../interface/userInterface';
import { handleApiError } from './errorApi';
import { API_ENDPOINTS } from '../constants';
import { axiosInstance } from './axiosInstance';

export const apiGetGoogleAuthURL = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GOOGLE_AUTH_URL);

        return { success: true, data: response.data as GoogleAuthURLResponse };
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiHandleGoogleCallback = async (payload: GoogleCallbackRequest) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GOOGLE_CALLBACK, {
            params: {
                code: payload.code,
                state: payload.state,
            },
        });

        return { success: true, data: response.data as GoogleCallbackResponse };
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiSignOut = async () => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.SIGN_OUT);

        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};