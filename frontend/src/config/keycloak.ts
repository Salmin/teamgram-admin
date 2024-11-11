import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8180',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
