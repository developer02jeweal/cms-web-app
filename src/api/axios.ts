import axios from "axios";

const api = axios.create({
  baseURL: "https://cms-api-jn1c.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST ================= */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE ================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - clearing session");

      // เคลียร์ session
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      sessionStorage.clear();

      // ป้องกัน redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
