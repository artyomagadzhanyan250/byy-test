
import React, { useEffect, useState } from "react";

import {
    Card,
    Switch,
    Spin,
    Empty,
    message,
    Typography,
    Space,
} from "antd";

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

import { todoService } from "../../services/todo.service";

import type { Todo as TodoType } from "../../types/todo.types";

import "./ToDo.scss";

const { Title, Paragraph, Text } = Typography;

const ToDo: React.FC = () => {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [loading, setLoading] = useState(true);

    const [updatingIds, setUpdatingIds] = useState<number[]>([]);

    // FETCH TODOS
    const fetchTodos = async () => {
        setLoading(true);

        try {
            const response = await todoService.getTodos();

            setTodos(response.results);

        } catch {
            message.error("Unable to load your tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // TOGGLE TODO COMPLETION
    const handleToggle = async (
        todo: TodoType,
        checked: boolean
    ) => {
        if (updatingIds.includes(todo.id)) return;

        const previousStatus = todo.completed;

        // Optimistic update
        setTodos((prev) =>
            prev.map((item) =>
                item.id === todo.id
                    ? { ...item, completed: checked }
                    : item
            )
        );

        setUpdatingIds((prev) => [...prev, todo.id]);

        try {
            const updatedTodo = await todoService.updateTodo(
                todo.id,
                { completed: checked }
            );

            setTodos((prev) =>
                prev.map((item) =>
                    item.id === todo.id
                        ? updatedTodo
                        : item
                )
            );

            message.success(
                checked
                    ? "Task completed!"
                    : "Task marked as incomplete."
            );

        } catch {
            // Roll back if backend update fails
            setTodos((prev) =>
                prev.map((item) =>
                    item.id === todo.id
                        ? { ...item, completed: previousStatus }
                        : item
                )
            );

            message.error("Unable to update task.");

        } finally {
            setUpdatingIds((prev) =>
                prev.filter((id) => id !== todo.id)
            );
        }
    };

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
                        {todos.filter((todo) => todo.completed).length}
                        {" / "}
                        {todos.length} completed
                    </Text>
                </div>

                {loading ? (
                    <div className="todo-loading">
                        <Spin size="large" />
                    </div>
                ) : todos.length === 0 ? (
                    <Empty
                        description="You don't have any tasks yet."
                    />
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
                                    loading={updatingIds.includes(todo.id)}
                                    onChange={(checked) =>
                                        handleToggle(todo, checked)
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
