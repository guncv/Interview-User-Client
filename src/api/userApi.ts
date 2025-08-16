import { AxiosError } from 'axios';
import { config } from '../env';
import type { UserForgotPasswordRequest, UserSignInRequest } from '../interface/userInterface';
import { handleApiError } from './errorApi';
import { API_ENDPOINTS, HTTP_HEADERS, ROLE } from '../constants';
import axiosInstance from './axiosInstance';

export const apiSignInMentor = async (payload: UserSignInRequest) => {
    try {
        const response = await axiosInstance.post(`${config.API_BASE_URL}${API_ENDPOINTS.SIGN_IN_MENTOR}`, {
            email: payload.email,
            password: payload.password,
        },
        {
            headers: {
                [HTTP_HEADERS.ROLE]: ROLE.TRAINEE,
            },
        });

        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiSetInitialPassword = async (password: string) => {
    try {
        const response = await axiosInstance.post(`${config.API_BASE_URL}${API_ENDPOINTS.SET_INITIAL_PASSWORD}`, {
            password,
        });

        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiForgotPassword = async (payload: UserForgotPasswordRequest) => {
    try {
        const response = await axiosInstance.post(`${config.API_BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD}`, {
            email: payload.email,
        });

        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiSignOut = async () => {
    try {
        const response = await axiosInstance.post(`${config.API_BASE_URL}${API_ENDPOINTS.SIGN_OUT}`);

        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};