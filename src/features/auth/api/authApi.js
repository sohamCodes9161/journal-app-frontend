import API from "@/services/api";

export async function loginUser(data) {
  const response = await API.post("/auth/login", data);

  return response.data.data;
}

export async function registerUser(data) {
  const response = await API.post("/auth/register", data);

  return response.data.data;
}

export async function logoutUser() {
  const response = await API.post("/auth/logout");

  return response.data.data;
}

export async function getCurrentUser() {
  const response = await API.get("/auth/me");

  return response.data.data;
}
