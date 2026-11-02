
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

import axios from "axios";

import { useAppDispatch } from "../../app/hooks";

import { setCredentials } from "../../features/auth/authSlice";

import { authService } from "../../services/auth.service";

import { tokenStorage } from "../../utils/tokenStorage";

import { useSignInValidation } from "../../hooks/useSignInValidation";

import type { SignInFormValues } from "../../types/signIn.types";

import "./SignInForm.scss";

const SignInForm: React.FC = () => {
    const [form] = Form.useForm<SignInFormValues>();

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    const {
        usernameRules,
        passwordRules,
    } = useSignInValidation();

    const handleSubmit = async (values: SignInFormValues) => {
        setLoading(true);

        try {
            const response = await authService.login({
                username: values.username,
                password: values.password,
            });

            // Save tokens
            tokenStorage.setTokens(
                response.access,
                response.refresh
            );

            // Update Redux
            dispatch(
                setCredentials({
                    access: response.access,
                    refresh: response.refresh,
                })
            );

            message.success("Sign in successful!");

            form.resetFields();

            navigate("/dashboard", { replace: true });

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const backendError = error.response?.data;

                if (backendError?.detail) {
                    message.error(backendError.detail);
                } else {
                    message.error(
                        "Unable to sign in. Please try again."
                    );
                }
            } else {
                message.error(
                    "Something went wrong. Please try again."
                );
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

export default SignInForm;
