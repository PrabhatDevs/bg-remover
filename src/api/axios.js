import axios from "axios";

const API = axios.create({
  baseURL: "https://unemitting-dalilah-inefficaciously.ngrok-free.dev",
  withCredentials: true, // 🔥 VERY IMPORTANT
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Optional: Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized - maybe not logged in");
    }
    return Promise.reject(error);
  },
);

export default API; // use this for axios.js
