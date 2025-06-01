import axios from "axios";

const BASE_URL = 'https://api.filipsiri.se/api/v1';
// const BASE_URL = 'https://localapi.test/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

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

      if (authStatus === "SessionExpired") {
        var result = await api.post("/auth/logout");
        return Promise.reject(error);
      }

      try {
        var result = await api.post("/auth/refresh");
        console.log(JSON.stringify(result.data))
        return api.request(originalRequest);
      } catch (refreshError) {
        console.log('Failed:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const useApi = () => api;