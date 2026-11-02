import axios, {
    type InternalAxiosRequestConfig,
    type AxiosError,
} from "axios";

import { tokenStorage } from "../utils/tokenStorage";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Separate client prevents refresh requests from triggering
// the same response interceptor.
const refreshClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Track whether a request has already been retried.
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Shared refresh promise prevents parallel refresh requests.
let refreshPromise: Promise<string> | null = null;

// Attach access token to every protected request.
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = tokenStorage.getAccessToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }
);

// Handle expired access tokens.
api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest =
            error.config as CustomAxiosRequestConfig | undefined;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url ?? "";

        // Never try refreshing after a failed login or refresh.
        if (
            requestUrl.includes("/token/") ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
            tokenStorage.clearTokens();
            window.location.assign("/login");

            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshClient
                    .post("/token/refresh/", {
                        refresh: refreshToken,
                    })
                    .then((response) => {
                        const { access, refresh } = response.data;

                        tokenStorage.setAccessToken(access);

                        // Support refresh token rotation if enabled.
                        if (refresh) {
                            tokenStorage.setRefreshToken(refresh);
                        }

                        return access as string;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {
            tokenStorage.clearTokens();

            window.location.assign("/login");

            return Promise.reject(refreshError);
        }
    }
);

export { refreshClient };
export default api;
