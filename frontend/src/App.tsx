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
        console.log('Используем конфигурацию:', initConfig);
        
        // Попытка инициализации
        const authenticated = await keycloak.init(initConfig);

        console.log('Keycloak initialized, authenticated:', authenticated);
        console.log('Init state:', {
          authenticated: keycloak.authenticated,
          token: !!keycloak.token,
          refreshToken: !!keycloak.refreshToken,
          subject: keycloak.subject,
          realmAccess: keycloak.realmAccess,
          resourceAccess: keycloak.resourceAccess,
          tokenParsed: keycloak.tokenParsed
        });
        
        if (authenticated) {
          console.log('Пользователь аутентифицирован');
          console.log('Token info:', {
            hasToken: !!keycloak.token,
            hasRefreshToken: !!keycloak.refreshToken,
            tokenParsed: keycloak.tokenParsed
          });
          
          // Подписываемся на обновление токена
          keycloak.onTokenExpired = () => {
            console.log('Token expired, attempting to refresh...');
            keycloak.updateToken(70).then((refreshed) => {
              console.log('Token refreshed:', refreshed);
            }).catch(err => {
              console.error('Token refresh error:', err);
              setError('Ошибка обновления токена: ' + (err.message || 'неизвестная ошибка'));
            });
          };
        } else {
          console.log('Пользователь не аутентифицирован, перенаправление на страницу входа...');
          try {
            // Используем конфигурацию по умолчанию для login
            await keycloak.login();
          } catch (loginError) {
            console.error('Login error:', loginError);
            setError('Ошибка входа: ' + (loginError instanceof Error ? loginError.message : 'неизвестная ошибка'));
          }
        }
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
        } else if (typeof err === 'object' && err !== null) {
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
      // Cleanup
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

  return (
    <Container>
      <UserList />
    </Container>
  );
};

export default App;
