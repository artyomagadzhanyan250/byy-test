import { useCreateTodoMutation } from "../../services/todosApi";
import {
    Alert,
    Button,
    Form,
    Input,
    message,
} from "antd";

interface CreateTodoFormValues {
    title: string;
    description: string;
}

const CreateTodoForm = () => {
    const [form] = Form.useForm<CreateTodoFormValues>();

    const [createTodo, { isLoading, error }] = useCreateTodoMutation();

    const handleSubmit = async (values: CreateTodoFormValues) => {
        try {
            await createTodo({
                title: values.title.trim(),
                description: values.description.trim(),
            }).unwrap();

            message.success("Todo created successfully!");
            form.resetFields();
        } catch {
            message.error("Failed to create todo. Please try again.");
        }
    };

    return (
        <div className="create-todo">
            <h3>Create a new todo</h3>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        { required: true, message: "Please enter a title." },
                        {
                            whitespace: true,
                            message: "Title cannot be empty.",
                        },
                    ]}
                >
                    <Input placeholder="What needs to be done?" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        { required: true, message: "Please enter a description." },
                        {
                            whitespace: true,
                            message: "Description cannot be empty.",
                        },
                    ]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Add some details..."
                    />
                </Form.Item>

                {error && (
                    <Alert
                        type="error"
                        message="Could not create todo."
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    block
                >
                    Add todo
                </Button>
            </Form>
        </div>
    );
};

export default CreateTodoForm;