import axios from 'axios';
import { config } from '../../env';
import { STORAGE_KEYS, HTTP_HEADERS, ERROR_CODES } from '../constants';

export const axiosInstance = axios.create({
    baseURL: config.Domain,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (accessToken) {
            config.headers[HTTP_HEADERS.AUTHORIZATION] = `${HTTP_HEADERS.BEARER} ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => {

        const newAccessToken = response.data?.access_token;
        if (newAccessToken) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        const errorCode = error.response?.data?.code;
        const shouldRefreshToken = errorCode === ERROR_CODES.AUTH_INVALID_ACCESS_TOKEN || 
                                 errorCode === ERROR_CODES.AUTH_EXPIRED_ACCESS_TOKEN ||
                                 errorCode === ERROR_CODES.AUTH_INVALID_TOKEN ||
                                 errorCode === ERROR_CODES.AUTH_EXPIRED_TOKEN;
        
        if (shouldRefreshToken && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const retryResponse = await axiosInstance(originalRequest);
                
                
                const newAccessToken = retryResponse.data?.access_token;
                if (newAccessToken) {
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
                }
                
                return retryResponse;
            } catch (retryError: any) {
                const retryErrorCode = retryError.response?.data?.code;
                const isStillTokenError = retryErrorCode === ERROR_CODES.AUTH_INVALID_ACCESS_TOKEN || 
                                        retryErrorCode === ERROR_CODES.AUTH_EXPIRED_ACCESS_TOKEN ||
                                        retryErrorCode === ERROR_CODES.AUTH_INVALID_TOKEN ||
                                        retryErrorCode === ERROR_CODES.AUTH_EXPIRED_TOKEN;
                
                if (isStillTokenError) {
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                    window.location.href = '/';
                }
                
                return Promise.reject(retryError);
            }
        }
        
        return Promise.reject(error);
    },
);

export default axiosInstance; 