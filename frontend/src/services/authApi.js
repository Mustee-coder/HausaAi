import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Shared axios instance — withCredentials: true means every request
// automatically sends/receives the httpOnly cookie, no need to repeat it.
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function extractErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong."
  );
}

export async function registerUser(name, email, password) {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function loginUser(email, password) {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function logoutUser() {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getCurrentUser() {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export default api;
