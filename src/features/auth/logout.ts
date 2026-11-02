import type { AppDispatch } from "../../app/store";

import { clearCredentials } from "./authSlice";

import { baseApi } from "../../api/baseApi";

import { tokenStorage } from "../../utils/tokenStorage";

export const logout = (dispatch: AppDispatch) => {
    // Clear persisted tokens
    tokenStorage.clearTokens();

    // Clear Redux authentication state
    dispatch(clearCredentials());

    // Clear cached API data
    dispatch(baseApi.util.resetApiState());
};
