import axios from 'axios';
import { User } from '../types/user';
import keycloak from '../config/keycloak';

const API_URL = 'https://salmin.in/teamgram-admin/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем перехватчик для установки токена авторизации
api.interceptors.request.use(async (config) => {
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});

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
