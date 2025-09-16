import axios from "axios";

const BASE_URL = 'https://api.filipsiri.se/api/v1';
// const BASE_URL = 'https://localapi.test/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Refreshing token in progress
let isRefreshing = false;

// Queue for requests with 401
let refreshSubscribers = [];

// When refreshing token is complete and no error, let them continue
function onRefreshed(error) {
  refreshSubscribers.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  refreshSubscribers = [];
}

// Add promises for requests that got 401
function subscribeTokenRefresh(resolve, reject) {
  refreshSubscribers.push({ resolve, reject });
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const authStatus = error.response.headers["x-auth-status"];

      // Logout if backend says so
      if (authStatus === "SessionExpired") {
        try {
          await api.post("/auth/logout");
        } catch {}
        isRefreshing = false;
        onRefreshed(new Error("Session expired"));
        return Promise.reject(error);
      }

      // If already refreshing token, add new promise for the 401:s
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(() => {
            api(originalRequest).then(resolve).catch(reject);
          },reject);
        });
      }

      // Do the actual refreshing
      try {
        isRefreshing = true;
        await api.post("/auth/refresh");
        isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshed(refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const useApi = () => api;
