import api from "../api/axios";

import type {
    Todo,
    TodoResponse,
    UpdateTodoRequest,
} from "../types/todo.types";

export const todoService = {
    // GET ALL TODOS
    getTodos: async (): Promise<TodoResponse> => {
        const response = await api.get<TodoResponse>("/todos/");

        return response.data;
    },

    // UPDATE TODO
    updateTodo: async (
        id: number,
        data: UpdateTodoRequest
    ): Promise<Todo> => {
        const response = await api.patch<Todo>(
            `/todos/${id}/`,
            data
        );

        return response.data;
    },
};
