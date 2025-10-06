export interface GoogleAuthURLResponse {
    auth_url: string;
}

export interface GoogleCallbackRequest {
    code: string;
    state?: string;
}

export interface GoogleCallbackResponse {
    access_token: string;
    refresh_token: string;
}