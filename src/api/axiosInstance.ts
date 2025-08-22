import axios from 'axios';
import { config } from '../../env';

export const axiosInstance = axios.create({
    baseURL: config.Domain,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance; 