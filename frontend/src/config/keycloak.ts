import Keycloak, { KeycloakInitOptions } from 'keycloak-js';

// Создаем конфигурацию как простой объект
const config = {
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
};

// Создаем экземпляр Keycloak с базовой конфигурацией
const keycloak = new Keycloak({
    url: config.url,
    realm: config.realm,
    clientId: config.clientId
});

// Экспортируем конфигурацию для использования при инициализации
export const initConfig: KeycloakInitOptions = {
    onLoad: 'login-required' as const,
    checkLoginIframe: false,
    pkceMethod: 'S256',
    redirectUri: window.location.origin, // без слеша в конце
    enableLogging: true, // включаем логирование
    responseMode: 'fragment',
    flow: 'standard'
};

// Добавляем обработчики событий
keycloak.onAuthSuccess = () => {
    console.log('Auth success');
    console.log('Token info:', {
        hasToken: !!keycloak.token,
        hasRefreshToken: !!keycloak.refreshToken,
        tokenParsed: keycloak.tokenParsed
    });
};

keycloak.onAuthError = (error) => {
    console.error('Auth error:', error);
};

keycloak.onAuthRefreshSuccess = () => {
    console.log('Auth refresh success');
};

keycloak.onAuthRefreshError = () => {
    console.error('Auth refresh error');
};

keycloak.onTokenExpired = () => {
    console.log('Token expired');
    keycloak.updateToken(70).then((refreshed) => {
        console.log('Token refreshed:', refreshed);
    }).catch(console.error);
};

export default keycloak;
