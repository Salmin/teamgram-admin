import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';

const keycloakConfig: KeycloakConfig & { credentials?: { secret: string } } = {
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin',
    credentials: {
        secret: '${CLIENT_SECRET}'
    }
};

const keycloak = new Keycloak(keycloakConfig);

// Экспортируем конфигурацию для использования при инициализации
export const initConfig: KeycloakInitOptions = {
    onLoad: 'login-required' as const,
    checkLoginIframe: false,
    pkceMethod: 'S256',
    redirectUri: window.location.origin // без слеша в конце
};

export default keycloak;
