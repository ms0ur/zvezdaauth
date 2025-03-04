import axios from "axios";
import { BASE_URL, MODIFY_API, REFRESH } from "../constants/api.ts";
import storage from '../storage';

export const api = axios.create({
    baseURL: BASE_URL + MODIFY_API,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const token = storage.getTokens().access_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = storage.getTokens().access_token;

            if (refreshToken) {
                try {
                    const { data } = await api.post(REFRESH, {
                        refresh_token: refreshToken
                    });

                    storage.setTokens(data)

                    return api(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);
