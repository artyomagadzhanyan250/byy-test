import React from "react";
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

import { Link } from "react-router-dom";

import { useSignInValidation } from "../../hooks/useSignInValidation";
import type { SignInFormValues } from "../../types/signIn.types";

import "./SignInForm.scss";

const SignInForm: React.FC = () => {
    const [form] = Form.useForm<SignInFormValues>();

    const {
        usernameRules,
        passwordRules,
    } = useSignInValidation();

    const handleSubmit = (values: SignInFormValues) => {
        console.log("Sign in data:", values);

        message.success("Sign in successful!");

        form.resetFields();
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
                    {/* Username */}
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={usernameRules}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter username"
                            maxLength={20}
                        />
                    </Form.Item>

                    {/* Password */}
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

                    {/* Submit */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
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
