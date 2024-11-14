import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin',
    credentials: {
        secret: '${CLIENT_SECRET}'
    }
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
