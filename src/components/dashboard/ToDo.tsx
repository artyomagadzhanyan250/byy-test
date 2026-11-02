import { useState } from "react";
import {
    Alert,
    Button,
    Card,
    Empty,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Select,
    Space,
    Spin,
    Switch,
    Typography,
} from "antd";

import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";

import {
    useUpdateTodoMutation,
    useDeleteTodoMutation,
} from "../../services/todosApi";

import type { Todo } from "../../types/todo.types";

const { Text, Title } = Typography;

interface EditTodoFormValues {
    title: string;
    description: string;
}

type SortOrder = "asc" | "desc";

interface ToDoProps {
    todos: Todo[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

const ToDo = ({
    todos,
    isLoading,
    isError,
    refetch,
}: ToDoProps) => {
    const [updateTodo, { isLoading: isUpdating }] =
        useUpdateTodoMutation();

    const [deleteTodo, { isLoading: isDeleting }] =
        useDeleteTodoMutation();

    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [editForm] = Form.useForm<EditTodoFormValues>();

    const filteredTodos = [...todos]
        .filter((todo) =>
            todo.title.toLowerCase().includes(searchText.trim().toLowerCase())
        )
        .sort((a, b) => {
            const comparison = a.title.localeCompare(b.title, undefined, {
                sensitivity: "base",
            });

            return sortOrder === "asc" ? comparison : -comparison;
        });

    const handleToggle = async (id: number, completed: boolean) => {
        try {
            await updateTodo({
                id,
                data: { completed },
            }).unwrap();

            message.success("Todo updated successfully!");
        } catch {
            message.error("Failed to update todo.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTodo(id).unwrap();
            message.success("Todo deleted successfully!");
        } catch {
            message.error("Failed to delete todo.");
        }
    };

    const openEditModal = (todo: Todo) => {
        setEditingTodo(todo);

        editForm.setFieldsValue({
            title: todo.title,
            description: todo.description,
        });
    };

    const closeEditModal = () => {
        setEditingTodo(null);
        editForm.resetFields();
    };

    const handleEditSubmit = async (values: EditTodoFormValues) => {
        if (!editingTodo) return;

        try {
            await updateTodo({
                id: editingTodo.id,
                data: {
                    title: values.title.trim(),
                    description: values.description.trim(),
                },
            }).unwrap();

            message.success("Todo edited successfully!");
            closeEditModal();
        } catch {
            message.error("Failed to edit todo.");
        }
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: 40 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <Alert
                type="error"
                showIcon
                message="Could not load your todos."
                action={
                    <Button size="small" onClick={refetch}>
                        Retry
                    </Button>
                }
            />
        );
    }

    return (
        <div>
            <Space
                style={{ width: "100%", marginBottom: 20 }}
                size="middle"
                wrap
            >
                <Input
                    placeholder="Search todos by title..."
                    prefix={<SearchOutlined />}
                    allowClear
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    style={{ width: 260 }}
                />

                <Select
                    value={sortOrder}
                    onChange={(value: SortOrder) => setSortOrder(value)}
                    style={{ width: 150 }}
                    options={[
                        { label: "Name: A–Z", value: "asc" },
                        { label: "Name: Z–A", value: "desc" },
                    ]}
                />
            </Space>

            {filteredTodos.length === 0 ? (
                <Empty
                    description={
                        todos.length
                            ? "No todos match your search."
                            : "No todos on this page."
                    }
                />
            ) : (
                <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                >
                    {filteredTodos.map((todo) => (
                        <Card key={todo.id} size="small">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 16,
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Title
                                        level={5}
                                        style={{
                                            margin: 0,
                                            textDecoration: todo.completed
                                                ? "line-through"
                                                : "none",
                                        }}
                                    >
                                        {todo.title}
                                    </Title>

                                    <Text type="secondary">
                                        {todo.description}
                                    </Text>
                                </div>

                                <Space size="small">
                                    <Switch
                                        checked={todo.completed}
                                        loading={isUpdating}
                                        onChange={(checked) =>
                                            handleToggle(todo.id, checked)
                                        }
                                    />

                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => openEditModal(todo)}
                                        aria-label={`Edit ${todo.title}`}
                                    />

                                    <Popconfirm
                                        title="Delete this todo?"
                                        description="This action cannot be undone."
                                        okText="Delete"
                                        cancelText="Cancel"
                                        okButtonProps={{ danger: true }}
                                        onConfirm={() => handleDelete(todo.id)}
                                    >
                                        <Button
                                            danger
                                            type="text"
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            loading={isDeleting}
                                            aria-label={`Delete ${todo.title}`}
                                        />
                                    </Popconfirm>
                                </Space>
                            </div>
                        </Card>
                    ))}
                </Space>
            )}

            <Modal
                title="Edit todo"
                open={editingTodo !== null}
                onCancel={closeEditModal}
                footer={null}
                destroyOnHidden
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            { required: true, message: "Please enter a title." },
                            { whitespace: true, message: "Title cannot be empty." },
                        ]}
                    >
                        <Input placeholder="Todo title" maxLength={200} />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Please enter a description.",
                            },
                            {
                                whitespace: true,
                                message: "Description cannot be empty.",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Todo description"
                        />
                    </Form.Item>

                    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                        <Button onClick={closeEditModal}>
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdating}
                        >
                            Save changes
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </div>
    );
};

export default ToDo;