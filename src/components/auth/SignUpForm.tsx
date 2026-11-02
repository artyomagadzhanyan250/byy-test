import React from "react";
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

import { useSignUpValidation } from "../../hooks/useSignUpValidation";
import type { SignUpFormValues } from "../../types/signUp.types";

import "./SignUpForm.scss";

import { Link } from "react-router-dom";

const SignUpForm: React.FC = () => {
    const [form] = Form.useForm<SignUpFormValues>();

    const {
        usernameRules,
        firstNameRules,
        lastNameRules,
        emailRules,
        passwordRules,
        confirmPasswordRules,
    } = useSignUpValidation();

    const handleSubmit = (values: SignUpFormValues) => {
        console.log("Sign up data:", values);

        message.success("Account created successfully!");

        form.resetFields();
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

                    {/* First Name and Last Name */}
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