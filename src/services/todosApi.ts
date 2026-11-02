import { baseApi } from "../api/baseApi";

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
}

export interface TodoResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Todo[];
}

export interface GetTodosParams {
    limit: number;
    offset: number;
}

export interface CreateTodoPayload {
    title: string;
    description: string;
}

export interface UpdateTodoPayload {
    id: number;
    data: Partial<Pick<Todo, "title" | "description" | "completed">>;
}

export const todosApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTodos: builder.query<TodoResponse, GetTodosParams>({
            query: ({ limit, offset }) => ({
                url: "/todos/",
                params: { limit, offset },
            }),

            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map((todo) => ({
                            type: "Todo" as const,
                            id: todo.id,
                        })),
                        { type: "Todo" as const, id: "LIST" },
                    ]
                    : [{ type: "Todo" as const, id: "LIST" }],
        }),

        createTodo: builder.mutation<Todo, CreateTodoPayload>({
            query: (body) => ({
                url: "/todos/",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Todo", id: "LIST" }],
        }),

        updateTodo: builder.mutation<Todo, UpdateTodoPayload>({
            query: ({ id, data }) => ({
                url: `/todos/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Todo", id },
                { type: "Todo", id: "LIST" },
            ],
        }),

        deleteTodo: builder.mutation<void, number>({
            query: (id) => ({
                url: `/todos/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Todo", id },
                { type: "Todo", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetTodosQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
} = todosApi;