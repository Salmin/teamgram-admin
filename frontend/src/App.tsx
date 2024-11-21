import React, { useEffect, useState } from 'react';
import { CircularProgress, Container, Box, Typography } from '@mui/material';
import keycloak, { initConfig } from './config/keycloak';
import UserList from './components/UserList';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        console.log('Начало инициализации Keycloak...');
        
        // Попытка инициализации
        const authenticated = await keycloak.init({
          ...initConfig,
          redirectUri: window.location.origin
        });

        console.log('Keycloak initialized:', {
          authenticated,
          token: !!keycloak.token,
          refreshToken: !!keycloak.refreshToken,
          tokenParsed: keycloak.tokenParsed
        });

        if (!authenticated) {
          console.log('Пользователь не аутентифицирован, перенаправление на страницу входа...');
          await keycloak.login({
            redirectUri: window.location.origin
          });
          return;
        }

      } catch (err) {
        console.error('Keycloak init error:', err);
        let errorMessage = 'Welcome!';
        
        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          errorMessage += ': ' + err.message;
        } else if (err && typeof err === 'object') {
          console.error('Error object:', err);
          errorMessage += ': ' + JSON.stringify(err);
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();

    return () => {
      try {
        keycloak.clearToken();
      } catch (e) {
        console.error('Error during cleanup:', e);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box mt={4}>
          <Typography color="error" variant="h5" align="center">
            {error}
          </Typography>
          <Typography color="textSecondary" variant="body1" align="center" mt={2}>
            Admin console.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!keycloak.authenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Выполняется вход в систему...
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      <UserList />
    </Container>
  );
};

export default App;
