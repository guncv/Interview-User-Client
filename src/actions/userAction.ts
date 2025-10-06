export const SET_USER_ERROR = 'SET_USER_ERROR';
export const SIGN_OUT = 'SIGN_OUT';
export const GET_GOOGLE_AUTH_URL = 'GET_GOOGLE_AUTH_URL';
export const HANDLE_GOOGLE_CALLBACK = 'HANDLE_GOOGLE_CALLBACK';

export const getGoogleAuthURL = () => {
    return { type: GET_GOOGLE_AUTH_URL };
};

export const handleGoogleCallback = (code: string, state?: string) => {
    return { type: HANDLE_GOOGLE_CALLBACK, payload: { code, state } };
};

export const setUserError = (message: string) => {
    return { type: SET_USER_ERROR, payload: { error: message } };
};

export const signOut = () => {
    return { type: SIGN_OUT };
};
