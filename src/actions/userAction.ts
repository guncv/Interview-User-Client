import type { UserSignUpRequest, UserVerifyEmailRequest } from "../interface/userInterface";

export const SIGN_IN = 'SIGN_IN';
export const SIGN_UP = 'SIGN_UP';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const SET_USER_ERROR = 'SET_USER_ERROR';
export const SIGN_OUT = 'SIGN_OUT';
export const VERIFY_EMAIL = 'VERIFY_EMAIL';
export const RESET_VERIFY_EMAIL = 'RESET_VERIFY_EMAIL';
export const RESET_PASSWORD = 'RESET_PASSWORD';

export const verifyEmail = (payload: UserVerifyEmailRequest) => {
    return { type: VERIFY_EMAIL, payload };
};

export const signUp = (payload: UserSignUpRequest) => {
    return { type: SIGN_UP, payload };
};

export const signIn = (email: string, password: string) => {
    return { type: SIGN_IN, payload: { email, password } };
};

export const forgotPassword = (email: string) => {
    return { type: FORGOT_PASSWORD, payload: { email } };
};

export const setUserError = (message: string) => {
    return { type: SET_USER_ERROR, payload: { error: message } };
};

export const signOut = () => {
    return { type: SIGN_OUT };
};

export const resetVerifyEmail = (token: string) => {
    return { type: RESET_VERIFY_EMAIL, payload: { token } };
};

export const resetPassword = (token: string, password: string) => {
    return { type: RESET_PASSWORD, payload: { token, password } };
};