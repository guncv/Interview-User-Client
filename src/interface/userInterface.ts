export interface UserSignInRequest {
    email: string;
    password: string;
}

export interface UserSignInResponse {
    id: string;
    access_token: string;
    is_temp_password: boolean;
}

export interface UserForgotPasswordRequest {
    email: string;
}

export interface UserResetPasswordRequest {
    token: string;
    password: string;
}

export interface UserSetInitialPasswordRequest {
    password: string;
}