import axios from 'axios';
import { config } from '../../env';
import { STORAGE_KEYS, ERROR_CODES, ROUTES } from '../constants';
import { apiRefreshToken } from './userApi';

export const axiosInstance = axios.create({
    baseURL: config.Domain,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh token calls
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    
    failedQueue = [];
};

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Check if we should attempt token refresh
        const shouldAttemptRefresh = !originalRequest._retry && (
            // 401 status with token-related error codes
            (error.response?.status === 401 && (
                error.response?.data?.code === ERROR_CODES.AUTH_INVALID_ACCESS_TOKEN ||
                error.response?.data?.code === ERROR_CODES.AUTH_EXPIRED_ACCESS_TOKEN ||
                error.response?.data?.code === ERROR_CODES.AUTH_INVALID_TOKEN ||
                error.response?.data?.code === ERROR_CODES.AUTH_EXPIRED_TOKEN
            )) ||
            // Also check for token errors in response data regardless of status
            (error.response?.data?.code === ERROR_CODES.AUTH_INVALID_ACCESS_TOKEN ||
                error.response?.data?.code === ERROR_CODES.AUTH_EXPIRED_ACCESS_TOKEN ||
                error.response?.data?.code === ERROR_CODES.AUTH_INVALID_TOKEN ||
                error.response?.data?.code === ERROR_CODES.AUTH_EXPIRED_TOKEN)
        );
        
        if (shouldAttemptRefresh && !isRefreshing) {
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                console.log('Attempting token refresh...');
                const refreshResponse = await apiRefreshToken();
                
                if (refreshResponse.success && 'data' in refreshResponse && refreshResponse.data?.access_token) {
                    console.log('Token refresh successful, updating token...');
                    // Store new access token
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshResponse.data.access_token);
                    
                    // Update the original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;
                    }
                    
                    // Process queued requests
                    processQueue(null, refreshResponse.data.access_token);
                    
                    // Retry the original request
                    console.log('Retrying original request with new token...');
                    return axiosInstance(originalRequest);
                } else {
                    console.log('Token refresh failed, redirecting to sign in...');
                    // Refresh token failed, redirect to sign in
                    processQueue(new Error('Refresh token failed'), null);
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                    window.location.href = ROUTES.SIGN_IN;
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.log('Token refresh request failed, redirecting to sign in...');
                // Refresh token request failed, redirect to sign in
                processQueue(refreshError, null);
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                window.location.href = ROUTES.SIGN_IN;
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        } else if (isRefreshing) {
            // If we're already refreshing, queue this request
            console.log('Token refresh in progress, queuing request...');
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                }
                return axiosInstance(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        } else {
            // Check for refresh token errors that should force sign in
            const errorCode = error.response?.data?.code;
            const isRefreshTokenError = errorCode === ERROR_CODES.AUTH_INVALID_REFRESH_TOKEN ||
                                    errorCode === ERROR_CODES.AUTH_EXPIRED_REFRESH_TOKEN;
            
            if (isRefreshTokenError) {
                console.log('Refresh token error detected, forcing sign in...');
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                window.location.href = ROUTES.SIGN_IN;
            }
        }
        
        return Promise.reject(error);
    },
);

export default axiosInstance; 