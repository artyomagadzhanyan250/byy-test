import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { tokenStorage } from "../../utils/tokenStorage";

const ProtectedRoute: React.FC = () => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (!accessToken && !refreshToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
