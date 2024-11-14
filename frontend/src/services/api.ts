import keycloak from '../config/keycloak';
import { User } from '../types/user';

const API_URL = '/api';

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${keycloak.token}`,
    'Content-Type': 'application/json'
});

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(`${API_URL}/users/list`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const deleteUser = async (userId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/users/delete/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
