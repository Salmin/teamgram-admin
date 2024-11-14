import Keycloak, { KeycloakInitOptions } from 'keycloak-js';

// Создаем конфигурацию как простой объект
const config = {
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
};

console.log('Creating Keycloak instance with config:', config);

// Создаем экземпляр Keycloak с базовой конфигурацией
const keycloak = new Keycloak({
    url: config.url,
    realm: config.realm,
    clientId: config.clientId
});

// Экспортируем конфигурацию для использования при инициализации
export const initConfig: KeycloakInitOptions = {
    onLoad: 'login-required',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    checkLoginIframe: false,
    responseMode: 'query',
    flow: 'implicit',
    scope: 'openid profile email roles',
    useNonce: true,
    enableLogging: true
};

// Добавляем обработчики событий
keycloak.onAuthSuccess = () => {
    console.log('Auth success');
    console.log('Token info:', {
        hasToken: !!keycloak.token,
        hasRefreshToken: !!keycloak.refreshToken,
        tokenParsed: keycloak.tokenParsed,
        subject: keycloak.subject,
        realmAccess: keycloak.realmAccess,
        resourceAccess: keycloak.resourceAccess,
        idTokenParsed: keycloak.idTokenParsed
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
        },
        error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : error
    });
};

keycloak.onAuthRefreshSuccess = () => {
    console.log('Auth refresh success');
    console.log('New token:', !!keycloak.token);
};

keycloak.onAuthRefreshError = () => {
    console.error('Auth refresh error');
    console.error('Token state:', {
        token: !!keycloak.token,
        refreshToken: !!keycloak.refreshToken
    });
};

keycloak.onTokenExpired = () => {
    console.log('Token expired');
    keycloak.updateToken(70).then((refreshed) => {
        console.log('Token refreshed:', refreshed);
    }).catch(console.error);
};

keycloak.onAuthLogout = () => {
    console.log('Auth logout');
};

export default keycloak;
