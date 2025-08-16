export const SIGN_IN_MENTOR = 'SIGN_IN_MENTOR';
export const SET_INITIAL_PASSWORD = 'SET_INITIAL_PASSWORD';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const SET_USER_ERROR = 'SET_USER_ERROR';
export const SIGN_OUT = 'SIGN_OUT';

export const signInMentor = (email: string, password: string) => {
    return { type: SIGN_IN_MENTOR, payload: { email, password } };
};

export const setInitialPassword = (password: string) => {
    return { type: SET_INITIAL_PASSWORD, payload: { password } };
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