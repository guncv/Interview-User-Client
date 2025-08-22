import axios from 'axios';
import { config } from '../../env';
import { STORAGE_KEYS } from '../constants';

export const axiosInstance = axios.create({
    baseURL: config.Domain,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

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