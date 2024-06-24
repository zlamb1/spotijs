import axios from 'axios';
import { AuthScope, Scope } from './scope'
import { StorageCache, LocalStorageCache } from './cache';

const token_url = 'https://accounts.spotify.com/api/token';

export interface ServiceInfo {
    client_id: string,
    scopes: AuthScope[],
    verify_uri: string,
    auth_uri: string,
    on_verify?: () => void,
    on_auth?: () => void,
}

export interface AuthToken {
    timeAcquired: number,
    expiresIn: number,
    accessToken: string,
    refreshToken: string
}

export class APIService {
    serviceInfo: ServiceInfo;
    storageCache: StorageCache = new LocalStorageCache();
    authToken?: AuthToken = undefined; 

    private codeVerifierLocation = "spotijs_code_verifier";
    private authTokenLocation = 'spotijs_auth_token';

    constructor(service_info: ServiceInfo) {
        this.serviceInfo = service_info; 
        this.loadCachedToken(); 
    }

    loadCachedToken() {
        const item = this.storageCache.getItem(this.authTokenLocation);
        if (item) {
            this.authToken = JSON.parse(item) as AuthToken;
            const elapsed = Date.now() - this.authToken.timeAcquired;
            if (Math.floor(elapsed) > this.authToken.expiresIn) {
                this.refreshToken();
            }
        }
    }

    authenticateService() {
        if (this.verifyService()) return false;

        const code_verifier = generateCodeVerifier(128);
        this.storageCache.setItem(this.codeVerifierLocation, code_verifier);
        
        const auth_info: AuthInfo = {
            client_id: this.serviceInfo.client_id,
            code_verifier: code_verifier,
            redirect_uri: this.serviceInfo.verify_uri,
            scopes: [AuthScope.All]
        }
    
        redirectToAuthFlow(auth_info);
    }

    verifyService() {
        const url = getStrippedURL();

        const code_verifier = this.storageCache.getItem(this.codeVerifierLocation); 
        this.storageCache.removeItem(this.codeVerifierLocation); 

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        params.delete("code");
        const paramStr = params.toString(); 
        window.history.replaceState(null, '', `/${paramStr ? '?' + params.toString() : ''}`);

        if (!code_verifier || !code) return false; 
        
        const token_info: TokenInfo = {
            client_id: this.serviceInfo.client_id,
            code: code!,
            redirect_uri: this.serviceInfo.auth_uri,
            code_verifier: code_verifier
        }

        requestAuthToken(token_info).then((res: any) => {
            this.updateToken(res.data);
        });

        return true; 
    }

    refreshToken() {
        if (!this.authToken?.refreshToken) {
            return false; 
        }

        axios({
            method: 'post',
            url: token_url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.authToken.refreshToken,
                client_id: this.serviceInfo.client_id
            })
        }).then(res => {
            this.updateToken(res.data);
        });
    }

    private updateToken(data: any) {
        if (!data) return false;

        this.authToken = {
            timeAcquired: Date.now(),
            expiresIn: data?.expires_in,
            accessToken: data?.access_token,
            refreshToken: data?.refresh_token
        }

        this.storageCache.setItem(this.authTokenLocation, JSON.stringify(this.authToken));
    }
}

function getStrippedURL() : string {
    return location.protocol + '//' + location.host + location.pathname; 
}

function generateCodeVerifier(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

interface AuthInfo {
    client_id: string,
    code_verifier: string,
    redirect_uri: string,
    scopes: AuthScope[]
}

async function redirectToAuthFlow(auth_info: AuthInfo): Promise<void> {
    const challenge = await generateCodeChallenge(auth_info.code_verifier);
    const params = new URLSearchParams();
    params.append("client_id", auth_info.client_id);
    params.append("response_type", "code");
    params.append("redirect_uri", auth_info.redirect_uri);
    params.append("scope", Scope.asString(auth_info.scopes));
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    const auth_url = 'https://accounts.spotify.com/authorize?';
    document.location = auth_url + params.toString();
}

interface TokenInfo {
    client_id: string,
    code: string,
    redirect_uri: string,
    code_verifier: string
}

async function requestAuthToken(token_info: TokenInfo): Promise<void> {
    return axios({
        method: 'post',
        url: token_url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
            client_id: token_info.client_id,
            grant_type: 'authorization_code',
            code: token_info.code,
            redirect_uri: token_info.redirect_uri,
            code_verifier: token_info.code_verifier
        }
    });
}