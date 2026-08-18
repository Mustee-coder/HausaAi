import { useEffect, useRef, useState } from "react";
import {
  sendMessage,
  getConversations,
  getConversationById,
  deleteConversation,
} from "../services/aiApi";
import { logoutUser } from "../services/authApi";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatMessages from "../components/chat/ChatMessages";
import ChatInput from "../components/chat/ChatInput";

const MODES = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "learn", label: "Learn", icon: "📚" },
  { id: "translate", label: "Translate", icon: "🌍" },
  { id: "job", label: "Job", icon: "💼" },
];

const ChatPage = ({ user, onLogout }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat");
  const [conversationId, setConversationId] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* ---------------- LOAD CONVERSATIONS ---------------- */

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoadingConversations(true);

        const data = await getConversations();

        setConversations(data || []);
      } catch (error) {
        console.error("Load conversations error:", error);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      onLogout?.();
      setLoggingOut(false);
    }
  };

  /* ---------------- NEW CHAT ---------------- */

  const handleNewChat = () => {
    if (loading || loadingConversation) return;

    setMessages([]);
    setConversationId(null);
    setMode("chat");
    setMessage("");
    setSidebarOpen(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  /* ---------------- CLEAR CHAT ---------------- */

  const handleClearChat = () => {
    if (loading || loadingConversation) return;

    setMessages([]);
    setConversationId(null);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  /* ---------------- MODE CHANGE ---------------- */

  const handleModeChange = (newMode) => {
    if (loading || loadingConversation || newMode === mode) {
      return;
    }

    setMode(newMode);
    setMessages([]);
    setConversationId(null);
    setMessage("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  /* ---------------- SELECT CONVERSATION ---------------- */

  const handleSelectConversation = async (id) => {
    if (
      loading ||
      loadingConversation ||
      mode !== "chat" ||
      id === conversationId
    ) {
      return;
    }

    try {
      setLoadingConversation(true);

      const data = await getConversationById(id);

      setConversationId(data.conversation?._id || id);

      setMode("chat");

      setMessages(
        (data.messages || []).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))
      );

      setSidebarOpen(false);
    } catch (error) {
      console.error("Load conversation error:", error);
    } finally {
      setLoadingConversation(false);
    }
  };

  /* ---------------- DELETE CONVERSATION ---------------- */

  const handleDeleteConversation = async (id) => {
    if (loading || loadingConversation) return;

    try {
      await deleteConversation(id);

      setConversations((prev) =>
        prev.filter((conversation) => conversation._id !== id)
      );

      if (conversationId === id) {
        setMessages([]);
        setConversationId(null);
      }
    } catch (error) {
      console.error("Delete conversation error:", error);
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();

    if (!userMessage || loading) {
      return;
    }

    const history = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const data = await sendMessage(
        userMessage,
        mode,
        history,
        conversationId
      );

      if (mode === "chat" && data.conversationId) {
        setConversationId(data.conversationId);

        const updatedConversations = await getConversations();

        setConversations(updatedConversations || []);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "An samu matsala wajen haɗawa da HausaAI. Ka sake gwadawa.",
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  /* ---------------- UI ---------------- */

  const currentModeLabel =
    mode === "chat"
      ? "Chat"
      : MODES.find((item) => item.id === mode)?.label;

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-950 text-white">
      {/* SIDEBAR */}
      <ChatSidebar
        user={user}
        conversations={conversations}
        loadingConversations={loadingConversations}
        loading={loading}
        loadingConversation={loadingConversation}
        loggingOut={loggingOut}
        conversationId={conversationId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onLogout={handleLogout}
      />

      {/* MAIN */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* TOP HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/70 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold sm:text-base">
                {currentModeLabel}
              </h2>

              <p className="truncate text-xs text-slate-500">
                HausaAI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                disabled={loading || loadingConversation}
                className="rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-800 hover:text-white md:hidden"
            >
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        </header>

        {/* CHAT CONTENT */}
        <div className="flex min-h-0 flex-1 flex-col">
          <ChatMessages
            messages={messages}
            loading={loading}
            loadingConversation={loadingConversation}
            user={user}
            mode={mode}
            modes={MODES}
            onModeChange={handleModeChange}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            message={message}
            setMessage={setMessage}
            mode={mode}
            modes={MODES}
            loading={loading}
            loadingConversation={loadingConversation}
            inputRef={inputRef}
            onSubmit={handleSubmit}
            onModeChange={handleModeChange}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;