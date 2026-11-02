import type { FormRule } from "antd";

export const useSignInValidation = () => {
    const usernameRules: FormRule[] = [
        {
            required: true,
            message: "Username is required",
        },
    ];

    const passwordRules: FormRule[] = [
        {
            required: true,
            message: "Password is required",
        },
    ];

    return {
        usernameRules,
        passwordRules,
    };
};