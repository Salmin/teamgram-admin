import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin',
    credentials: {
        secret: '${CLIENT_SECRET}' // Будет заменено при сборке Docker
    }
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
