import api, { refreshClient } from "../api/axios";
import { tokenStorage } from "../utils/tokenStorage";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface TokenResponse {
    access: string;
    refresh?: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export const authService = {
    // SIGN IN
    login: async (data: LoginRequest): Promise<TokenResponse> => {
        const response = await api.post<TokenResponse>(
            "/token/",
            data
        );

        const { access, refresh } = response.data;

        tokenStorage.setTokens(access, refresh!);

        return response.data;
    },

    // REFRESH ACCESS TOKEN
    refreshToken: async (): Promise<string> => {
        const refresh = tokenStorage.getRefreshToken();

        if (!refresh) {
            throw new Error("Refresh token not found");
        }

        const response = await refreshClient.post<TokenResponse>(
            "/token/refresh/",
            { refresh }
        );

        const { access, refresh: newRefresh } = response.data;

        tokenStorage.setAccessToken(access);

        if (newRefresh) {
            tokenStorage.setRefreshToken(newRefresh);
        }

        return access;
    },

    // REGISTER
    register: async (data: RegisterRequest) => {
        const response = await api.post("/register/", data);

        return response.data;
    },

    // LOG OUT
    logout: () => {
        tokenStorage.clearTokens();
    },
};
