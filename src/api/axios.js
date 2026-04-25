import axios from "axios";

const API = axios.create({
  baseURL: "https://unemitting-dalilah-inefficaciously.ngrok-free.dev",
  headers: {
    "ngrok-skip-browser-warning": "69420", // 🔥 ADD THIS
    "X-App-Client": "bgremover-frontend-v1"
  },
  // ❌ remove this
  // withCredentials: true,
});

// ✅ Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Optional: Handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      console.log("Unauthorized - token removed");
    }
    return Promise.reject(error);
  }
);

export default API;