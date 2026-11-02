import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Space,
    Typography,
    message,
} from "antd";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/logout";

import CreateTodoForm from "../components/dashboard/CreateTodoForm";
import ToDo from "../components/dashboard/ToDo";
import Pagination from "../components/dashboard/Pagination";

import { useGetTodosQuery } from "../services/todosApi";

const { Title } = Typography;

const PAGE_SIZE = 20;

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    const offset = (currentPage - 1) * PAGE_SIZE;

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetTodosQuery({
        limit: PAGE_SIZE,
        offset,
    });

    const handleLogout = () => {
        logout(dispatch);

        message.success("Logged out successfully!");
        navigate("/login", { replace: true });
    };

    // If deleting the last item on a page makes that page invalid,
    // automatically move back to the previous available page.
    useEffect(() => {
        if (!data) return;

        const totalPages = Math.max(1, Math.ceil(data.count / PAGE_SIZE));

        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [data, currentPage]);

    return (
        <div style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
            <Card>
                <Space
                    align="center"
                    style={{
                        width: "100%",
                        justifyContent: "space-between",
                        marginBottom: 24,
                    }}
                >
                    <Title level={2} style={{ margin: 0 }}>
                        My Dashboard
                    </Title>

                    <Button onClick={handleLogout}>
                        Logout
                    </Button>
                </Space>

                <CreateTodoForm />

                <div style={{ marginTop: 32 }}>
                    <Title level={3}>My Todos</Title>

                    <ToDo
                        todos={data?.results ?? []}
                        isLoading={isLoading}
                        isError={isError}
                        refetch={() => {
                            void refetch();
                        }}
                    />

                    <Pagination
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        total={data?.count ?? 0}
                        onChange={setCurrentPage}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;