import type { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { STORAGE_KEYS, ERROR_CODES, ROUTES } from '../constants';

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
    let response: ApiResponse = yield call(apiCall, ...args);
    
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
        response = yield call(apiCall, ...args);
        
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

export function isAnyAuthError(errorCode?: string): boolean {
    return isTokenError(errorCode) || isRefreshTokenError(errorCode);
}

export function shouldForceSignIn(errorCode?: string): boolean {
    // Force sign in for refresh token errors or if we've exhausted token refresh attempts
    return isRefreshTokenError(errorCode);
}

export function handleAuthError(errorCode?: string): void {
    if (isRefreshTokenError(errorCode)) {
        // Clear both tokens and redirect to sign in
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = ROUTES.SIGN_IN;
    } else if (isTokenError(errorCode)) {
        // Clear access token only, let the interceptor handle refresh
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
}
