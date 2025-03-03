import axios from "axios";
import { BASE_URL, MODIFY_API, REFRESH } from "../constants/api.ts";
import { storage, STORAGE_KEYS } from '../storage';

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
        const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Интерсептор для ответа: при ошибке 401 выполняем рефреш токена и повторяем запрос
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Если сервер возвращает 401 и запрос ещё не был повторен
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);

            if (refreshToken) {
                try {
                    // Выполняем запрос на обновление токена
                    const { data } = await api.post(REFRESH, {
                        refresh_token: refreshToken
                    });

                    // Сохраняем новые токены в localStorage
                    storage.set(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
                    storage.set(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);

                    // Обновляем заголовок Authorization в оригинальном запросе
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;

                    // Повторяем оригинальный запрос с новыми токенами
                    return api(originalRequest);
                } catch (refreshError) {
                    // Если обновление токена не удалось, можно выполнить логику разлогинивания или редирект на страницу логина
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);
