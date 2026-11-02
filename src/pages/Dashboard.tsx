import React from "react";

import {
    Button,
    Card,
    Typography,
    message,
} from "antd";

import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/logout";

import ToDo from "../components/dashboard/ToDo";

import "./Dashboard.scss";

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout(dispatch);

        message.success("You have been logged out.");

        navigate("/login", { replace: true });
    };

    return (
        <div className="dashboard">
            <Card className="dashboard-header">
                <Title level={3}>Dashboard</Title>

                <Button
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Card>

            <ToDo />
        </div>
    );
};

export default Dashboard;
