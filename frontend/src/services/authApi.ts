import axios from "axios";
import type { AxiosError } from "axios";

const API_BASE = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://hausaai.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiErrorResponse {
  message?: string;
}

function extractErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  return (
    axiosError.response?.data?.message ||
    axiosError.message ||
    "Something went wrong."
  );
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return res.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function loginUser(
  email: string,
  password: string
) {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    return res.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function logoutUser() {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getCurrentUser() {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}

export default api;