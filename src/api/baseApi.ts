import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import type { RootState } from "../app/store";

import {
    setCredentials,
    clearCredentials,
} from "../features/auth/authSlice";

import { tokenStorage } from "../utils/tokenStorage";

const BASE_URL = import.meta.env.VITE_API_URL;

// Base query
const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;

        const token = state.auth.accessToken;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

// Shared refresh promise
let refreshPromise: Promise<string | null> | null = null;

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {

    let result = await rawBaseQuery(args, api, extraOptions);

    // Only handle expired/invalid access tokens.
    if (result.error?.status === 401) {

        const requestUrl =
            typeof args === "string" ? args : args.url;

        // Don't refresh the login or refresh endpoints.
        if (
            requestUrl.includes("/token/") ||
            requestUrl.includes("/register/")
        ) {
            return result;
        }

        const state = api.getState() as RootState;

        const refreshToken = state.auth.refreshToken;

        if (!refreshToken) {
            tokenStorage.clearTokens();
            api.dispatch(clearCredentials());
            api.dispatch(baseApi.util.resetApiState());

            return result;
        }

        // Only one refresh request at a time.
        if (!refreshPromise) {
            refreshPromise = (async () => {
                try {
                    const refreshResult = await rawBaseQuery(
                        {
                            url: "/token/refresh/",
                            method: "POST",
                            body: {
                                refresh: refreshToken,
                            },
                        },
                        api,
                        extraOptions
                    );

                    if (refreshResult.data) {
                        const data = refreshResult.data as {
                            access: string;
                            refresh?: string;
                        };

                        tokenStorage.setAccessToken(data.access);

                        if (data.refresh) {
                            tokenStorage.setRefreshToken(data.refresh);
                        }

                        api.dispatch(
                            setCredentials({
                                access: data.access,
                                refresh: data.refresh ?? refreshToken,
                            })
                        );

                        return data.access;
                    }

                    return null;

                } catch {
                    return null;
                }
            })().finally(() => {
                refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        if (newAccessToken) {
            // Retry original request using the updated Redux token.
            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            tokenStorage.clearTokens();

            api.dispatch(clearCredentials());
            api.dispatch(baseApi.util.resetApiState());
        }
    }

    return result;
};

// Main API
export const baseApi = createApi({
    reducerPath: "api",

    baseQuery: baseQueryWithReauth,

    tagTypes: ["Todo"],

    endpoints: () => ({}),
});
