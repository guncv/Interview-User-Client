import type { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { STORAGE_KEYS, ERROR_CODES } from '../constants';

export interface ApiResponse {
    success: boolean;
    data?: any;
    code?: string;
    statusCode?: number;
    message?: string;
}

export function* callWithTokenRefresh<T extends ApiResponse>(
    apiCall: (...args: any[]) => any,
    ...args: any[]
): SagaIterator<T> {
    let token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    let response: ApiResponse = yield call(apiCall, ...args, token);
    
    // Check if we got a new access token in the response body
    if (response && response.success && response.data?.access_token) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
    }
    
    const shouldRefreshToken = response && !response.success && (
        response.code === ERROR_CODES.AUTH_INVALID_ACCESS_TOKEN ||
        response.code === ERROR_CODES.AUTH_EXPIRED_ACCESS_TOKEN ||
        response.code === ERROR_CODES.AUTH_INVALID_TOKEN ||
        response.code === ERROR_CODES.AUTH_EXPIRED_TOKEN
    );
    
    if (shouldRefreshToken) {
        response = yield call(apiCall, ...args, token);
        
        // Check if we got a new access token in the retry response
        if (response && response.success && response.data?.access_token) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
        }
        
        if (!response.success && (
            response.code === ERROR_CODES.AUTH_INVALID_ACCESS_TOKEN ||
            response.code === ERROR_CODES.AUTH_EXPIRED_ACCESS_TOKEN ||
            response.code === ERROR_CODES.AUTH_INVALID_TOKEN ||
            response.code === ERROR_CODES.AUTH_EXPIRED_TOKEN
        )) {
            return response as T;
        }
    }
    
    return response as T;
}

export function isTokenError(errorCode?: string): boolean {
    return errorCode === ERROR_CODES.AUTH_INVALID_ACCESS_TOKEN ||
        errorCode === ERROR_CODES.AUTH_EXPIRED_ACCESS_TOKEN ||
        errorCode === ERROR_CODES.AUTH_INVALID_TOKEN ||
        errorCode === ERROR_CODES.AUTH_EXPIRED_TOKEN;
}

export function isRefreshTokenError(errorCode?: string): boolean {
    return errorCode === ERROR_CODES.AUTH_INVALID_REFRESH_TOKEN ||
        errorCode === ERROR_CODES.AUTH_EXPIRED_REFRESH_TOKEN;
}
