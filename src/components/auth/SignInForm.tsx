
import React, { useState } from "react";

import {
    Form,
    Input,
    Button,
    Card,
    message,
} from "antd";

import {
    UserOutlined,
    LockOutlined,
} from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";

import { useSignInValidation } from "../../hooks/useSignInValidation";
import type { SignInFormValues } from "../../types/signIn.types";

import { authService } from "../../services/auth.service";

import "./SignInForm.scss";

const SignInForm: React.FC = () => {
    const [form] = Form.useForm<SignInFormValues>();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {
        usernameRules,
        passwordRules,
    } = useSignInValidation();

    const handleSubmit = async (values: SignInFormValues) => {
        setLoading(true);

        try {
            await authService.login({
                username: values.username,
                password: values.password,
            });

            message.success("Sign in successful!");

            form.resetFields();

            navigate("/dashboard", { replace: true });

        } catch (error: unknown) {
            if (axiosError(error)) {
                const backendError = error.response?.data as {
                    detail?: string;
                    username?: string[];
                    password?: string[];
                } | undefined;

                if (backendError?.detail) {
                    message.error(backendError.detail);
                } else if (
                    backendError?.username ||
                    backendError?.password
                ) {
                    form.setFields([
                        {
                            name: "username",
                            errors: backendError.username ?? [],
                        },
                        {
                            name: "password",
                            errors: backendError.password ?? [],
                        },
                    ]);
                } else {
                    message.error("Unable to sign in. Please try again.");
                }
            } else {
                message.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-form-wrapper">
            <Card className="signin-card">
                <h2>Welcome Back!</h2>

                <p className="form-subtitle">
                    Please enter your credentials to sign in.
                </p>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={usernameRules}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter username"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={passwordRules}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter password"
                            maxLength={64}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            disabled={loading}
                            className="submit-btn"
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <div className="auth-link">
                    Don't have an account?{" "}
                    <Link to="/register">Sign Up</Link>
                </div>
            </Card>
        </div>
    );
};

// Axios error type guard
import axios from "axios";

const axiosError = (error: unknown): error is import("axios").AxiosError => {
    return axios.isAxiosError(error);
};

export default SignInForm;
