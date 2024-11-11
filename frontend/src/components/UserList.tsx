import React, { useEffect, useState } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    IconButton,
    Typography,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../types/user';
import { userApi } from '../services/api';
import keycloak from '../config/keycloak';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>('');

    const loadUsers = async () => {
        try {
            const data = await userApi.getUsers();
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Ошибка при загрузке пользователей');
            console.error('Error loading users:', err);
        }
    };

    const handleDelete = async (userId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await userApi.deleteUser(userId);
                setUsers(users.filter(user => user.userId !== userId));
                setError('');
            } catch (err) {
                setError('Ошибка при удалении пользователя');
                console.error('Error deleting user:', err);
            }
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const canDelete = keycloak.hasRealmRole('ADMIN_DELETE');

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Пользователи Teamgram
            </Typography>
            
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>Имя</TableCell>
                            <TableCell>Фамилия</TableCell>
                            <TableCell>Имя пользователя</TableCell>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>Статус</TableCell>
                            {canDelete && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{formatDate(user.createdAt)}</TableCell>
                                <TableCell>
                                    {user.deleted ? 'Удален' : 'Активен'}
                                </TableCell>
                                {canDelete && (
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => handleDelete(user.userId)}
                                            color="error"
                                            disabled={user.deleted}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserList;
