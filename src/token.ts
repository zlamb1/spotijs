import axios from 'axios';
import { AuthScope, Scope } from './scope';
 
export const TOKEN_URL = 'https://accounts.spotify.com/api/token';

export interface AuthToken {
    timeAcquired: number,
    expiresIn: number,
    accessToken: string,
    refreshToken: string
}

export function getStrippedURL() : string {
    return location.protocol + '//' + location.host + location.pathname; 
}

export function generateCodeVerifier(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export interface AuthInfo {
    client_id: string,
    code_verifier: string,
    redirect_uri: string,
    scopes: AuthScope[]
}

export async function redirectToAuthFlow(auth_info: AuthInfo): Promise<void> {
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

export interface TokenInfo {
    client_id: string,
    code: string,
    redirect_uri: string,
    code_verifier: string
}

export async function requestAuthToken(token_info: TokenInfo): Promise<void> {
    return axios({
        method: 'post',
        url: TOKEN_URL,
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