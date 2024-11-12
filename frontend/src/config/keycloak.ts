import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://auth.salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
