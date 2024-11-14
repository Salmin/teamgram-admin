import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin',
    credentials: {
        secret: '${CLIENT_SECRET}'
    }
};

// Инициализация без явного указания redirectUri
// Keycloak будет использовать текущий URL без слеша в конце
const keycloak = new Keycloak({
    url: keycloakConfig.url,
    realm: keycloakConfig.realm,
    clientId: keycloakConfig.clientId
});

export default keycloak;
