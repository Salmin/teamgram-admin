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
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../types/user';
import { deleteUser, getUsers } from '../services/api';
import keycloak from '../config/keycloak';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteInProgress, setDeleteInProgress] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
      if (err instanceof Error) {
        if (err.message === 'Authentication required') {
          setError('Требуется повторная аутентификация');
          await keycloak.login();
        } else {
          setError(`Ошибка при загрузке пользователей: ${err.message}`);
        }
      } else {
        setError('Ошибка при загрузке пользователей');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      setDeleteInProgress(userId);
      setError('');
      await deleteUser(userId);
      setUsers(users.filter(user => user.userId !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      if (err instanceof Error) {
        if (err.message === 'Authentication required') {
          setError('Требуется повторная аутентификация');
          await keycloak.login();
        } else {
          setError(`Ошибка при удалении пользователя: ${err.message}`);
        }
      } else {
        setError('Ошибка при удалении пользователя');
      }
    } finally {
      setDeleteInProgress(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Список пользователей
      </Typography>

      {error && (
        <Box mb={2}>
          <Alert severity="error">
            <AlertTitle>Ошибка</AlertTitle>
            {error}
          </Alert>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя пользователя</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="textSecondary">
                    Нет доступных пользователей
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.deleted ? "Удален" : "Активен"}
                      color={user.deleted ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(user.userId)}
                      disabled={deleteInProgress === user.userId || user.deleted}
                    >
                      {deleteInProgress === user.userId ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
