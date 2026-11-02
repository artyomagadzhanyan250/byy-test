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

export interface UpdateTodoRequest {
    completed: boolean;
}
