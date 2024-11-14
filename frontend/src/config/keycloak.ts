import Keycloak, { KeycloakInitOptions } from 'keycloak-js';

// Создаем экземпляр Keycloak с базовой конфигурацией
const keycloak = new Keycloak({
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
});

// Базовая конфигурация для инициализации
export const initConfig: KeycloakInitOptions = {
    onLoad: 'login-required',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256' as const,
    checkLoginIframe: false,
    enableLogging: true
};

// Добавляем обработчики событий
keycloak.onAuthSuccess = () => {
    console.log('Auth success:', {
        token: !!keycloak.token,
        refreshToken: !!keycloak.refreshToken,
        idToken: !!keycloak.idToken,
        tokenParsed: keycloak.tokenParsed,
        realmAccess: keycloak.realmAccess,
        resourceAccess: keycloak.resourceAccess
    });
};

keycloak.onAuthError = (error) => {
    console.error('Auth error:', error);
    if (error && typeof error === 'object') {
        console.error('Error details:', JSON.stringify(error, null, 2));
    }
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
    console.log('Token refresh success:', {
        token: !!keycloak.token,
        refreshToken: !!keycloak.refreshToken,
        tokenParsed: keycloak.tokenParsed
    });
};

keycloak.onAuthRefreshError = () => {
    console.error('Token refresh error');
    console.error('Current state:', {
        token: !!keycloak.token,
        refreshToken: !!keycloak.refreshToken,
        authenticated: keycloak.authenticated,
        tokenParsed: keycloak.tokenParsed
    });
    // При ошибке обновления токена пробуем перелогиниться
    keycloak.login();
};

keycloak.onTokenExpired = () => {
    console.log('Token expired, attempting refresh...');
    keycloak.updateToken(70).catch((error) => {
        console.error('Failed to refresh token:', error);
        keycloak.login();
    });
};

keycloak.onAuthLogout = () => {
    console.log('Auth logout');
    window.location.reload();
};

export default keycloak;
