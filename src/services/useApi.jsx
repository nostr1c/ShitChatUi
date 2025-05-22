import axios from "axios";

const BASE_URL = 'https://api.filipsiri.se/api/v1';
// const BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        var result = await api.post("/auth/refresh");
        console.log(JSON.stringify(result.data))
        return api.request(originalRequest);
      } catch (refreshError) {
        console.log('Failed:', JSON.stringify(refreshError));
      }
    }

    return Promise.reject(error);
  }
);

export const useApi = () => api;