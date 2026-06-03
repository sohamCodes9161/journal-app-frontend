import API from "@/services/api";

export const createTodo = async (todoData) => {
  const response = await API.post("/todos", todoData);

  return response.data.data;
};

export const getTodos = async (params = {}) => {
  const response = await API.get("/todos", {
    params,
  });

  return response.data.data;
};

export const getTodoById = async (todoId) => {
  const response = await API.get(`/todos/${todoId}`);

  return response.data.data;
};

export const updateTodo = async ({ todoId, data }) => {
  const response = await API.patch(`/todos/${todoId}`, data);

  return response.data.data;
};

export const deleteTodo = async (todoId) => {
  const response = await API.delete(`/todos/${todoId}`);

  return response.data.data;
};
