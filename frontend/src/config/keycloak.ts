import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://salmin.in/auth',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
