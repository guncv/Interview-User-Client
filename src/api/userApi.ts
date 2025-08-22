import { AxiosError } from 'axios';
import type { UserForgotPasswordRequest, UserSignInRequest, UserSignUpRequest, UserVerifyEmailRequest } from '../interface/userInterface';
import { handleApiError } from './errorApi';
import { API_ENDPOINTS, HTTP_HEADERS, ROLE } from '../constants';
import { axiosInstance } from './axiosInstance';
import { STORAGE_KEYS } from '../constants';

export const apiResetVerifyEmail = async (token: string) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.RESET_VERIFY_EMAIL, {
            token: token,
        });

        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiResetPassword = async (token: string, password: string) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, {
            token: token,
            new_password: password,
        });

        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiSignUp = async (payload: UserSignUpRequest) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.SIGN_UP, {
            email: payload.email,
            password: payload.password,
            full_name: payload.full_name,
            country: payload.country,
            gender: payload.gender,
            date_of_birth: payload.date_of_birth,
        });

        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiVerifyEmail = async (payload: UserVerifyEmailRequest) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, {
            token: payload.token,
            code: payload.code,
        });

        return { success: true, data: response.data };
    }
    catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const apiSignIn = async (payload: UserSignInRequest) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.SIGN_IN, {
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

export const apiForgotPassword = async (payload: UserForgotPasswordRequest) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
            email: payload.email,
        });

        return { success: true, data: response.data };
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

export const apiRefreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
            return { success: false, statusCode: 401, message: 'No refresh token available' };
        }

        const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
            refresh_token: refreshToken,
        });

        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};