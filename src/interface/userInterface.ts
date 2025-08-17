export interface UserSignInRequest {
    email: string;
    password: string;
}

export interface UserSignUpRequest {
    email: string;
    password: string;
    full_name: string;
    country: string;
    gender: string;
    date_of_birth: string;
}

export interface UserVerifyEmailRequest {
    token: string;
    code: string;
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