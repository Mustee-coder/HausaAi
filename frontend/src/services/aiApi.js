import axios from "axios";

const API_BASE = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://hausaai.onrender.com/api";

// Shared instance — withCredentials ensures the httpOnly auth cookie
// is sent on every request, so requireAuth middleware doesn't reject us.
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Maps each mode to its actual backend route.
const MODE_ENDPOINTS = {
  chat: "/chat",
  translate: "/translate",
  job: "/job",
  learn: "/learn",
};

/**
 * Sends a message to the correct endpoint based on mode.
 * - chat: supports conversationId (for persisted history)
 * - learn: supports history (stateless, frontend-managed context)
 * - translate / job: stateless, no history needed
 */
export const sendMessage = async (message, mode = "chat", history = [], conversationId = null) => {
  const endpoint = MODE_ENDPOINTS[mode] || MODE_ENDPOINTS.chat;

  const payload = { message };

  if (mode === "chat") {
    if (conversationId) payload.conversationId = conversationId;
    // chat mode's history is pulled server-side from the DB, not sent by the client
  } else if (mode === "learn") {
    payload.history = history;
  }
  // translate and job are stateless — no history sent

  const response = await api.post(endpoint, payload);

  if (!response.data.success) {
    throw new Error(response.data.message || "Something went wrong.");
  }

  return response.data;
};

export const getConversations = async () => {
  const response = await api.get("/chat/conversations");

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Could not fetch conversations."
    );
  }

  return response.data.conversations;
};

export const getConversationById = async (conversationId) => {
  const response = await api.get(`/chat/${conversationId}`);

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Could not fetch conversation."
    );
  }

  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`/chat/${conversationId}`);

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Could not delete conversation."
    );
  }

  return response.data;
};


export default api;
