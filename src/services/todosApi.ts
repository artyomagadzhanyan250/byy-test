import { baseApi } from "../api/baseApi";

import type {
    Todo,
    TodoResponse,
} from "../types/todo.types";

interface UpdateTodoRequest {
    completed: boolean;
}

export const todosApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET TODOS
        getTodos: builder.query<TodoResponse, void>({
            query: () => "/todos/",

            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({
                            type: "Todo" as const,
                            id,
                        })),
                        { type: "Todo" as const, id: "LIST" },
                    ]
                    : [{ type: "Todo", id: "LIST" }],
        }),

        // UPDATE TODO COMPLETION
        updateTodo: builder.mutation<
            Todo,
            { id: number; data: UpdateTodoRequest }
        >({
            query: ({ id, data }) => ({
                url: `/todos/${id}/`,
                method: "PATCH",
                body: data,
            }),

            // Optimistic update
            async onQueryStarted(
                { id, data },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    todosApi.util.updateQueryData(
                        "getTodos",
                        undefined,
                        (draft) => {
                            const todo = draft.results.find(
                                (item) => item.id === id
                            );

                            if (todo) {
                                todo.completed = data.completed;
                            }
                        }
                    )
                );

                try {
                    const { data: updatedTodo } = await queryFulfilled;

                    dispatch(
                        todosApi.util.updateQueryData(
                            "getTodos",
                            undefined,
                            (draft) => {
                                const index = draft.results.findIndex(
                                    (item) => item.id === id
                                );

                                if (index !== -1) {
                                    draft.results[index] = updatedTodo;
                                }
                            }
                        )
                    );

                } catch {
                    patchResult.undo();
                }
            },

            invalidatesTags: (_result, _error, { id }) => [
                { type: "Todo", id },
            ],
        }),

    }),
});

export const {
    useGetTodosQuery,
    useUpdateTodoMutation,
} = todosApi;
