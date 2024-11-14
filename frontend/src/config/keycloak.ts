import Keycloak from 'keycloak-js';

// Создаем экземпляр Keycloak с базовой конфигурацией
const keycloak = new Keycloak({
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
});

// Базовая конфигурация для инициализации
export const initConfig = {
    onLoad: 'login-required' as const,
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
};

// Добавляем обработчики событий
keycloak.onAuthSuccess = () => {
    console.log('Auth success:', {
        token: !!keycloak.token,
        refreshToken: !!keycloak.refreshToken,
        idToken: !!keycloak.idToken
    });
};

keycloak.onAuthError = (error) => {
    console.error('Auth error:', error);
    console.error('Auth state:', {
        authenticated: keycloak.authenticated,
        token: !!keycloak.token,
        refreshToken: !!keycloak.refreshToken,
        config: {
            url: keycloak.authServerUrl,
            realm: keycloak.realm,
            clientId: keycloak.clientId
        }
    });
};

keycloak.onAuthRefreshSuccess = () => {
    console.log('Token refresh success');
};

keycloak.onAuthRefreshError = () => {
    console.error('Token refresh error');
    window.location.reload();
};

keycloak.onTokenExpired = () => {
    console.log('Token expired, attempting refresh...');
    keycloak.updateToken(70).catch(() => {
        console.error('Failed to refresh token');
        keycloak.login();
    });
};

keycloak.onAuthLogout = () => {
    console.log('Auth logout');
    window.location.reload();
};

export default keycloak;
