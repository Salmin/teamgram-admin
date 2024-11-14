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
import { deleteUser, getUsers } from '../services/api';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
      console.error('Error loading users:', err);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Ошибка при удалении пользователя');
      console.error('Error deleting user:', err);
    }
  };

  if (error) {
    return (
      <Box mt={4}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Список пользователей
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя пользователя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
