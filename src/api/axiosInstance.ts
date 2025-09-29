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
        const newAccessToken = response.headers[STORAGE_KEYS.X_ACCESS_TOKEN_LOWER] || response.headers[STORAGE_KEYS.X_ACCESS_TOKEN]

        if (newAccessToken && newAccessToken !== '') {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        }
        
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance; 