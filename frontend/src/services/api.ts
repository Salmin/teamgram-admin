import axios from 'axios';
import { User } from '../types/user';
import keycloak from '../config/keycloak';

const API_URL = 'https://admin.salmin.in/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем перехватчик для установки токена авторизации
api.interceptors.request.use(async (config) => {
    try {
        // Проверяем, нужно ли обновить токен
        if (keycloak.token) {
            const updateRequired = await keycloak.updateToken(70);
            if (updateRequired) {
                console.log('Token was successfully updated');
            }
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    } catch (error) {
        console.error('Failed to update token:', error);
        // В случае ошибки обновления токена, перенаправляем на повторную аутентификацию
        await keycloak.login();
        return Promise.reject(error);
    }
});

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            console.log('Received 401 response, redirecting to login');
            await keycloak.login();
        }
        return Promise.reject(error);
    }
);

export const userApi = {
    getUsers: async (): Promise<User[]> => {
        const response = await api.get('/users/list');
        return response.data;
    },

    deleteUser: async (userId: number): Promise<void> => {
        await api.delete(`/users/delete/${userId}`);
    }
};

export default api;
