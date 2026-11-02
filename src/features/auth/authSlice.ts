import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { tokenStorage } from "../../utils/tokenStorage";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    accessToken: tokenStorage.getAccessToken(),
    refreshToken: tokenStorage.getRefreshToken(),
};

interface CredentialsPayload {
    access: string;
    refresh?: string;
}

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<CredentialsPayload>
        ) => {
            state.accessToken = action.payload.access;

            if (action.payload.refresh) {
                state.refreshToken = action.payload.refresh;
            }
        },

        clearCredentials: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const {
    setCredentials,
    clearCredentials,
} = authSlice.actions;

export const selectAccessToken = (state: { auth: AuthState }) =>
    state.auth.accessToken;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
    Boolean(state.auth.accessToken || state.auth.refreshToken);

export default authSlice.reducer;
