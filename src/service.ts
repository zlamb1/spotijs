import axios from 'axios';
import { AuthScope } from './scope'
import { StorageCache, LocalStorageCache } from './cache';
import { AuthInfo, AuthToken, TOKEN_URL, TokenInfo, generateCodeVerifier, getStrippedURL, redirectToAuthFlow, requestAuthToken } from './token';
import { APIProvider, AxiosConsumer, NetworkConsumer } from './provider';

export interface ServiceInfo {
    client_id: string,
    scopes: AuthScope[],
    verify_uri: string,
    auth_uri: string,
}

export enum APIState {
    InvalidClient = 'invalid_client',
    Pending = 'pending',
    Ready = 'ready',
    Unknown = 'unknown',
}

export class APIService {
    serviceInfo: ServiceInfo;
    apiState: APIState = APIState.Pending;
    storageCache: StorageCache = new LocalStorageCache();
    authToken?: AuthToken = undefined; 

    networkConsumer: NetworkConsumer = new AxiosConsumer(this);
    apiProvider: APIProvider = new APIProvider(this.networkConsumer);

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
            if (Math.floor(elapsed / 1000) > this.authToken.expiresIn) {
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
        }).catch(res => {
            this.apiState = parseErrorState(res?.response);
        });

        return true; 
    }

    refreshToken() {
        if (!this.authToken?.refreshToken) {
            return false; 
        }

        axios({
            method: 'post',
            url: TOKEN_URL,
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
        }).catch(res => {
            this.apiState = parseErrorState(res?.response);
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
        this.apiState = APIState.Ready; 
    }
}

function parseErrorState(res: any) {
    if (res?.status == 400) {
        if (res?.data?.error == 'invalid_client') {
            return APIState.InvalidClient; 
        }
    }

    return APIState.Unknown;
}