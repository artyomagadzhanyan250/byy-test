
import React from "react";

import {
    Card,
    Switch,
    Spin,
    Empty,
    message,
    Typography,
    Space,
    Alert,
    Button,
} from "antd";

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

import {
    useGetTodosQuery,
    useUpdateTodoMutation,
} from "../../services/todosApi";

import "./ToDo.scss";

const { Title, Paragraph, Text } = Typography;

const ToDo: React.FC = () => {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetTodosQuery();

    const [
        updateTodo,
        { isLoading: isUpdating },
    ] = useUpdateTodoMutation();

    const todos = data?.results ?? [];

    const completedCount = todos.filter(
        (todo) => todo.completed
    ).length;

    const handleToggle = async (
        id: number,
        completed: boolean
    ) => {
        try {
            await updateTodo({
                id,
                data: { completed },
            }).unwrap();

            message.success(
                completed
                    ? "Task completed!"
                    : "Task marked as incomplete."
            );

        } catch {
            message.error("Unable to update task.");
        }
    };

    if (isLoading) {
        return (
            <div className="todo-loading">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="todo-wrapper">
                <Alert
                    type="error"
                    showIcon
                    message="Unable to load tasks"
                    description="Something went wrong while fetching your todos."
                    action={
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => refetch()}
                        >
                            Retry
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="todo-wrapper">
            <Card className="todo-card">
                <div className="todo-header">
                    <div>
                        <Title level={3}>My Tasks</Title>

                        <Paragraph className="todo-subtitle">
                            Manage your daily tasks.
                        </Paragraph>
                    </div>

                    <Text type="secondary">
                        {completedCount} / {todos.length} completed
                    </Text>
                </div>

                {todos.length === 0 ? (
                    <Empty description="You don't have any tasks yet." />
                ) : (
                    <Space
                        direction="vertical"
                        size="middle"
                        className="todo-list"
                    >
                        {todos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`todo-item ${todo.completed ? "completed" : ""
                                    }`}
                            >
                                <div className="todo-content">
                                    <div className="todo-title">
                                        {todo.completed ? (
                                            <CheckCircleOutlined />
                                        ) : (
                                            <ClockCircleOutlined />
                                        )}

                                        <Title level={5}>
                                            {todo.title}
                                        </Title>
                                    </div>

                                    <Paragraph className="todo-description">
                                        {todo.description}
                                    </Paragraph>

                                    <Text
                                        type="secondary"
                                        className="todo-status"
                                    >
                                        {todo.completed
                                            ? "Completed"
                                            : "In progress"}
                                    </Text>
                                </div>

                                <Switch
                                    checked={todo.completed}
                                    loading={isUpdating}
                                    onChange={(checked) =>
                                        handleToggle(todo.id, checked)
                                    }
                                />
                            </div>
                        ))}
                    </Space>
                )}
            </Card>
        </div>
    );
};

export default ToDo;
