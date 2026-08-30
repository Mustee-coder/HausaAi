import axios from "axios";

const API_BASE = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://hausaai.onrender.com/api";

// Types
type Mode = "chat" | "translate" | "job" | "learn";

interface HistoryMessage {
  role: string;
  content: string;
}

interface Payload {
  message: string;
  conversationId?: string;
  history?: HistoryMessage[];
}

// Shared Axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Maps each mode to its backend route
const MODE_ENDPOINTS: Record<Mode, string> = {
  chat: "/chat",
  translate: "/translate",
  job: "/job",
  learn: "/learn",
};

/**
 * Sends a message to the correct endpoint based on mode.
 */
export const sendMessage = async (
  message: string,
  mode: Mode = "chat",
  history: HistoryMessage[] = [],
  conversationId: string | null = null
) => {
  const endpoint =
    MODE_ENDPOINTS[mode] || MODE_ENDPOINTS.chat;

  const payload: Payload = {
    message,
  };

  if (mode === "chat") {
    if (conversationId) {
      payload.conversationId = conversationId;
    }
  } else if (mode === "learn") {
    payload.history = history;
  }

  const response = await api.post(endpoint, payload);

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Something went wrong."
    );
  }

  return response.data;
};

export const getConversations = async () => {
  const response = await api.get("/chat/conversations");

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Could not fetch conversations."
    );
  }

  return response.data.conversations;
};

export const getConversationById = async (
  conversationId: string
) => {
  const response = await api.get(
    `/chat/${conversationId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Could not fetch conversation."
    );
  }

  return response.data;
};

export const deleteConversation = async (
  conversationId: string
) => {
  const response = await api.delete(
    `/chat/${conversationId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Could not delete conversation."
    );
  }

  return response.data;
};

export default api;