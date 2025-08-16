import { AxiosError } from 'axios';

export interface ErrorResponse {
    success: boolean;
    code: string;
    message: string;
    statusCode: number;
    err: unknown;
}

export const handleApiError = (error: AxiosError): ErrorResponse => {
    if (error.message === 'Network Error') {
        return {
            success: false,
            code: 'NETWORK_ERROR',
            message: 'Network error occurred. Please check your connection.',
            statusCode: 0,
            err: null,
        };
    }

    if (error.response && error.response.data) {
        const data = error.response.data as Partial<ErrorResponse>;
        return {
            success: false,
            code: data.code || 'UNKNOWN',
            message: data.message || 'An unexpected error occurred.',
            statusCode: error.response.status,
            err: data.err || null,
        };
    } else {
        return {
            success: false,
            code: 'UNKNOWN',
            message: error.message || 'Error in sending request',
            statusCode: error.response?.status || 0,
            err: null,
        };
    }
};
