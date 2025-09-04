import axios from "axios";

const BASE_URL = 'https://api.filipsiri.se/api/v1';
// const BASE_URL = 'https://localapi.test/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(error) {
  refreshSubscribers.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  refreshSubscribers = [];
}

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

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(
            () => {
              api(originalRequest).then(resolve).catch(reject);
            },
            reject
          );
        });
      }

      isRefreshing = true;
      const authStatus = error.response.headers["x-auth-status"];

      if (authStatus === "SessionExpired") {
        try {
          await api.post("/auth/logout");
        } catch {}
        isRefreshing = false;
        onRefreshed(new Error("Session expired"));
        return Promise.reject(error);
      }

      try {
        await api.post("/auth/refresh");
        console.log("Token refreshed");

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
