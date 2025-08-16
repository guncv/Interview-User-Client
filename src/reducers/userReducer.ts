import { createSelector } from '@reduxjs/toolkit';
import {
    SET_USER_ERROR,
} from '../actions/userAction';
import type { RootState } from './rootReducer';

type UserState = {
    error: string;
}
type UserStateAction = {
    type: string;
    payload: {
        error: string;
    }
}
const initialState: UserState = {
    error: '',
};

export const userReducer = (
    state: UserState = initialState,
    action: UserStateAction,
    ): UserState => {
        switch (action.type) {
        case SET_USER_ERROR:
            return {
            ...state,
            error: action.payload.error,
            };
        default:
            return state;
        }
    };
    
    const selectUser = (state: RootState) => state.user;
    
    export const userSelector = createSelector(
        [selectUser],
        (user: UserState) => ({
        error: user.error,
        }),
    );
