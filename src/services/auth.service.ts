import api from "../api/axios";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export interface ApiError {
    [field: string]: string[] | string;
}

export const authService = {
    register: async (data: RegisterRequest) => {
        const response = await api.post("/register/", data);

        return response.data;
    },
};
