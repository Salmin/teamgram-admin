import Keycloak, { KeycloakInitOptions } from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
});

export const initConfig: KeycloakInitOptions = {
    onLoad: 'login-required',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    checkLoginIframe: false,
    pkceMethod: 'S256',
    scope: 'openid profile email',
    redirectUri: window.location.origin
};

keycloak.onAuthSuccess = () => {
    console.log('Auth success');
    console.log('Token info:', {
        hasToken: !!keycloak.token,
        hasRefreshToken: !!keycloak.refreshToken,
        tokenParsed: keycloak.tokenParsed,
        subject: keycloak.subject,
        realmAccess: keycloak.realmAccess,
        resourceAccess: keycloak.resourceAccess
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
        }
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
