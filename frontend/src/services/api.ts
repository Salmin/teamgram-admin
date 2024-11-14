import keycloak from '../config/keycloak';
import { User } from '../types/user';

const API_URL = '/api';

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${keycloak.token}`,
    'Content-Type': 'application/json'
});

const handleResponse = async (response: Response, options: RequestInit) => {
    if (!response.ok) {
        if (response.status === 401) {
            // Если получили 401, пробуем обновить токен
            try {
                const refreshed = await keycloak.updateToken(70);
                if (refreshed) {
                    console.log('Token was refreshed');
                    // Повторяем запрос с новым токеном
                    const newResponse = await fetch(response.url, {
                        ...options,
                        headers: getAuthHeaders()
                    });
                    if (newResponse.ok) {
                        return newResponse;
                    }
                }
            } catch (error) {
                console.error('Failed to refresh token:', error);
                // Если не удалось обновить токен, перенаправляем на логин
                await keycloak.login();
                throw new Error('Authentication required');
            }
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return response;
};

const makeRequest = async <T>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    try {
        // Пробуем обновить токен перед каждым запросом
        try {
            await keycloak.updateToken(70);
        } catch (error) {
            console.error('Token refresh failed:', error);
            await keycloak.login();
            throw new Error('Authentication required');
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...(options.headers || {})
            }
        });

        const handledResponse = await handleResponse(response, options);
        return await handledResponse.json();
    } catch (error) {
        console.error('API request failed:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Unknown error occurred');
    }
};

export const getUsers = async (): Promise<User[]> => {
    return makeRequest<User[]>(`${API_URL}/users/list`);
};

export const deleteUser = async (userId: number): Promise<void> => {
    return makeRequest<void>(`${API_URL}/users/delete/${userId}`, {
        method: 'DELETE'
    });
};
