import type { FormRule } from "antd";

export const useSignUpValidation = () => {
    const usernameRules: FormRule[] = [
        { required: true, message: "Username is required" },
        { min: 3, max: 20, message: "Username must be 3–20 characters" },
        {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "Only letters, numbers and underscores allowed",
        },
    ];

    const firstNameRules: FormRule[] = [
        { required: true, message: "First name is required" },
        { max: 50, message: "Maximum 50 characters allowed" },
        {
            pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            message: "Please enter a valid first name",
        },
    ];

    const lastNameRules: FormRule[] = [
        { required: true, message: "Last name is required" },
        { max: 50, message: "Maximum 50 characters allowed" },
        {
            pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            message: "Please enter a valid last name",
        },
    ];

    const emailRules: FormRule[] = [
        { required: true, message: "Email is required" },
        { type: "email", message: "Please enter a valid email address" },
        { max: 100, message: "Email cannot exceed 100 characters" },
    ];

    const passwordRules: FormRule[] = [
        { required: true, message: "Password is required" },
        {
            min: 8,
            max: 64,
            message: "Password must be 8–64 characters",
        },
        {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
            message: "Include uppercase, lowercase, number and special character",
        },
    ];

    const confirmPasswordRules: FormRule[] = [
        {
            required: true,
            message: "Please confirm your password",
        },
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                }

                return Promise.reject(new Error("Passwords do not match"));
            },
        }),
    ];

    return {
        usernameRules,
        firstNameRules,
        lastNameRules,
        emailRules,
        passwordRules,
        confirmPasswordRules,
    };
};