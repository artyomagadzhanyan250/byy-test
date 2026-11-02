import React, { useState } from "react";

import {
    Form,
    Input,
    Button,
    Card,
    Row,
    Col,
    message,
} from "antd";

import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
} from "@ant-design/icons";

import { useNavigate, Link } from "react-router-dom";

import { useSignUpValidation } from "../../hooks/useSignUpValidation";

import type { SignUpFormValues } from "../../types/signUp.types";

import {
    authService,
} from "../../services/auth.service";

import "./SignUpForm.scss";

const SignUpForm: React.FC = () => {
    const [form] = Form.useForm<SignUpFormValues>();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {
        usernameRules,
        firstNameRules,
        lastNameRules,
        emailRules,
        passwordRules,
        confirmPasswordRules,
    } = useSignUpValidation();

    const handleSubmit = async (values: SignUpFormValues) => {
        setLoading(true);

        // Clear previous backend validation errors.
        form.setFields([
            {
                name: "username",
                errors: [],
            },
            {
                name: "email",
                errors: [],
            },
            {
                name: "first_name",
                errors: [],
            },
            {
                name: "last_name",
                errors: [],
            },
            {
                name: "password",
                errors: [],
            },
        ]);

        try {
            await authService.register({
                username: values.username,
                email: values.email,
                password: values.password,
                first_name: values.first_name,
                last_name: values.last_name,
            });

            form.resetFields();

            message.success("Account created successfully!");

            navigate("/login", {
                state: {
                    registrationSuccess: true,
                },
            });

        } catch (error: any) {
            const responseData = error.response?.data;

            if (responseData && typeof responseData === "object") {
                const fieldErrors: {
                    name: keyof SignUpFormValues;
                    errors: string[];
                }[] = [];

                Object.entries(responseData).forEach(
                    ([field, errors]) => {
                        const errorMessages = Array.isArray(errors)
                            ? errors.map(String)
                            : [String(errors)];

                        // Map backend errors to Ant Design fields.
                        const knownFields = [
                            "username",
                            "email",
                            "first_name",
                            "last_name",
                            "password",
                            "confirm_password",
                        ];

                        if (knownFields.includes(field)) {
                            fieldErrors.push({
                                name: field as keyof SignUpFormValues,
                                errors: errorMessages,
                            });
                        } else {
                            message.error(errorMessages.join(" "));
                        }
                    }
                );

                if (fieldErrors.length > 0) {
                    form.setFields(fieldErrors);
                }
            } else {
                message.error(
                    "Something went wrong. Please try again later."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-form-wrapper">
            <Card className="signup-card">
                <h2>Create Account</h2>

                <p className="form-subtitle">
                    Please fill in your information below.
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
                            maxLength={20}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="First Name"
                                name="first_name"
                                rules={firstNameRules}
                            >
                                <Input
                                    placeholder="Enter first name"
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Last Name"
                                name="last_name"
                                rules={lastNameRules}
                            >
                                <Input
                                    placeholder="Enter last name"
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={emailRules}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Enter email address"
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={passwordRules}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter password"
                            maxLength={64}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirm_password"
                        dependencies={["password"]}
                        rules={confirmPasswordRules}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm password"
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
                            Sign Up
                        </Button>
                    </Form.Item>

                    <div className="auth-link">
                        Already have an account?{" "}
                        <Link to="/login">Sign In</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default SignUpForm;
