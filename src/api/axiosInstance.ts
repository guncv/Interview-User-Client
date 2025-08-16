import axios from 'axios';
import { config } from '../../env';
import { STORAGE_KEYS, HTTP_HEADERS } from '../constants';

const axiosInstance = axios.create({
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
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            window.location.href = '/';
        }
        return Promise.reject(error);
    },
);

export default axiosInstance; 