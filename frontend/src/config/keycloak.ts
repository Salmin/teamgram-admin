import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'https://salmin.in',
    realm: 'teamgram',
    clientId: 'teamgram-admin'
});

export const initConfig = {
    onLoad: 'login-required' as const,
    flow: 'standard' as const,
    responseMode: 'fragment' as const,
    checkLoginIframe: false
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
    if (error && typeof error === 'object') {
        console.error('Error details:', JSON.stringify(error, null, 2));
    }
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
