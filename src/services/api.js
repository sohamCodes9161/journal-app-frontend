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

console.log("API INTERCEPTOR LOADED");

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log("INTERCEPTOR CAUGHT ERROR");

    const originalRequest = error.config;

    // access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // prevent multiple refresh calls
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => API(originalRequest));
      }

      isRefreshing = true;

      try {
        console.log("TRYING REFRESH TOKEN");

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        console.log("REFRESH SUCCESS");

        processQueue();

        return API(originalRequest);
      } catch (refreshError) {
        console.log("REFRESH FAILED");

        processQueue(refreshError);

        window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
