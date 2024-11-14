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
        const authenticated = await keycloak.init(initConfig);

        console.log('Keycloak initialized:', {
          authenticated,
          token: !!keycloak.token,
          refreshToken: !!keycloak.refreshToken,
          tokenParsed: keycloak.tokenParsed
        });

        if (!authenticated) {
          console.log('Пользователь не аутентифицирован, перенаправление на страницу входа...');
          try {
            await keycloak.login({
              redirectUri: window.location.origin
            });
          } catch (loginError) {
            console.error('Login error:', loginError);
            throw loginError;
          }
          return;
        }

        // Настраиваем периодическое обновление токена
        const tokenUpdateInterval = setInterval(() => {
          if (keycloak.token) {
            keycloak.updateToken(70)
              .then(refreshed => {
                if (refreshed) {
                  console.log('Token was successfully refreshed');
                }
              })
              .catch(error => {
                console.error('Failed to refresh the token:', error);
                keycloak.login();
              });
          }
        }, 60000);

        return () => {
          clearInterval(tokenUpdateInterval);
        };

      } catch (err) {
        console.error('Keycloak init error:', err);
        let errorMessage = 'Ошибка инициализации Keycloak';
        
        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          errorMessage += ': ' + err.message;
        } else if (err && typeof err === 'object') {
          try {
            console.error('Error object:', JSON.stringify(err, null, 2));
            errorMessage += ': ' + JSON.stringify(err);
          } catch (e) {
            console.error('Error stringifying error object:', e);
            errorMessage += ': ' + String(err);
          }
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
            Проверьте консоль браузера для получения дополнительной информации.
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
