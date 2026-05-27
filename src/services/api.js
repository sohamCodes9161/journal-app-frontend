import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue = [];

function processQueue(error = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
}

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // stop if no response
    if (!error.response) {
      return Promise.reject(error);
    }

    // access token expired
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      // queue requests while refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => API(originalRequest));
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        processQueue();

        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // clear auth safely
        localStorage.clear();
        sessionStorage.clear();

        // IMPORTANT:
        // don't hard reload infinitely
        if (window.location.pathname !== "/auth/login") {
          window.location.replace("/auth/login");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
