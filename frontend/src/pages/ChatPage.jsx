import { useEffect, useRef, useState } from "react";
import {
  sendMessage,
  getConversations,
  getConversationById,
  deleteConversation,
} from "../services/aiApi";
import { logoutUser } from "../services/authApi";

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

  /* ---------------- CONVERSATION LIST ---------------- */

  const ConversationList = () => (
    <div className="flex-1 overflow-y-auto px-3 py-3">
      {loadingConversations ? (
        <div className="px-3 py-4 text-sm text-slate-500">
          Ana loda chats...
        </div>
      ) : conversations.length === 0 ? (
        <div className="px-3 py-4 text-sm text-slate-500">
          Babu tsoffin conversations.
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`group flex items-center gap-1 rounded-lg transition ${
                conversationId === conversation._id
                  ? "bg-slate-800"
                  : "hover:bg-slate-800/70"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  handleSelectConversation(conversation._id)
                }
                disabled={loading || loadingConversation}
                className="min-w-0 flex-1 px-3 py-2.5 text-left disabled:cursor-not-allowed"
              >
                <p className="truncate text-sm text-slate-200">
                  {conversation.title || "New Conversation"}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  {new Date(
                    conversation.updatedAt
                  ).toLocaleDateString()}
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeleteConversation(conversation._id)
                }
                disabled={loading || loadingConversation}
                className="mr-1 rounded-md px-2 py-1 text-xs text-slate-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                title="Delete conversation"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-950 text-white">

      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-slate-800/80 bg-slate-900/70 md:flex">

        {/* Logo */}

        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold">
            H
          </div>

          <div>
            <h1 className="font-bold">HausaAI</h1>

            <p className="text-[11px] text-slate-500">
              AI na Hausa
            </p>
          </div>
        </div>

        {/* New Chat */}

        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={handleNewChat}
            disabled={loading || loadingConversation}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium transition hover:bg-slate-700 disabled:opacity-50"
          >
            <span className="text-lg">+</span>
            Sabon Chat
          </button>
        </div>

        {/* Conversations */}

        <div className="px-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Chats
          </p>
        </div>

        <ConversationList />

        {/* User */}

        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-xl p-2">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-500">
                HausaAI user
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              {loggingOut ? "..." : "Logout"}
            </button>

          </div>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">

          <div className="flex w-[280px] flex-col border-r border-slate-800 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">
                  H
                </div>

                <span className="font-bold">
                  HausaAI
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800"
              >
                ✕
              </button>

            </div>

            <div className="p-3">

              <button
                type="button"
                onClick={handleNewChat}
                disabled={loading || loadingConversation}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
              >
                + Sabon Chat
              </button>

            </div>

            <ConversationList />

          </div>

          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

        </div>
      )}

      {/* ================= MAIN ================= */}

      <main className="flex min-w-0 flex-1 flex-col">

        {/* TOP HEADER */}

        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/70 px-4 sm:px-6">

          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile menu */}

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">

              <h2 className="truncate text-sm font-semibold sm:text-base">
                {mode === "chat"
                  ? "Chat"
                  : MODES.find((item) => item.id === mode)?.label}
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

        {/* ================= CHAT AREA ================= */}

        <div className="flex min-h-0 flex-1 flex-col">

          {/* Messages */}

          <div className="flex-1 overflow-y-auto">

            <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">

              {loadingConversation && (
                <div className="mb-6 text-center text-sm text-slate-500">
                  Ana loda conversation...
                </div>
              )}

              {/* Empty state */}

              {messages.length === 0 &&
                !loadingConversation && (
                  <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">

                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold shadow-lg shadow-blue-600/20">
                      H
                    </div>

                    <h1 className="text-2xl font-bold sm:text-3xl">
                      Barka da zuwa HausaAI
                    </h1>

                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
                      AI assistant da aka gina domin
                      masu magana da Hausa.
                    </p>

                    {/* Mode cards */}

                    <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3">

                      {MODES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            handleModeChange(item.id)
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            mode === item.id
                              ? "border-blue-500/40 bg-blue-500/10"
                              : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                          }`}
                        >

                          <div className="text-xl">
                            {item.icon}
                          </div>

                          <p className="mt-2 text-sm font-semibold">
                            {item.label}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.id === "chat" &&
                              "Yi magana da HausaAI"}

                            {item.id === "learn" &&
                              "Koyi sabon abu"}

                            {item.id === "translate" &&
                              "Hausa ↔ English"}

                            {item.id === "job" &&
                              "Nazarin job posts"}
                          </p>

                        </button>
                      ))}

                    </div>

                  </div>
                )}

              {/* Messages */}

              <div className="space-y-8">

                {messages.map((msg, index) => {

                  const isUser = msg.role === "user";

                  return (
                    <div
                      key={index}
                      className={`flex gap-3 sm:gap-4 ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold">
                          H
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] ${
                          isUser ? "order-first" : ""
                        }`}
                      >

                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
                            isUser
                              ? "rounded-br-md bg-blue-600 text-white"
                              : "rounded-bl-md bg-slate-900 text-slate-200"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>

                      </div>

                      {isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold">
                          {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>
                      )}

                    </div>
                  );
                })}

                {/* Loading */}

                {loading && (
                  <div className="flex gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold">
                      H
                    </div>

                    <div className="rounded-2xl rounded-bl-md bg-slate-900 px-5 py-4">

                      <div className="flex items-center gap-1.5">

                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                          style={{ animationDelay: "150ms" }}
                        />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                          style={{ animationDelay: "300ms" }}
                        />

                      </div>

                    </div>

                  </div>
                )}

                <div ref={messagesEndRef} />

              </div>

            </div>

          </div>

             {/* ================= INPUT AREA ================= */}

          <div className="shrink-0 px-3 pb-3 pt-2 sm:px-6 sm:pb-5">

            <div className="mx-auto max-w-3xl">

              {/* Mode selector */}

              <div className="mb-2 flex gap-1 overflow-x-auto">

                {MODES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleModeChange(item.id)
                    }
                    disabled={loading || loadingConversation}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
                      mode === item.id
                        ? "bg-blue-600/15 text-blue-400"
                        : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}

              </div>

              {/* Input */}

              <form
                onSubmit={handleSubmit}
                className="flex items-end gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl"
              >

                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder={
                    mode === "chat"
                      ? "Rubuta saƙonka..."
                      : mode === "learn"
                      ? "Me kake son koya?"
                      : mode === "translate"
                      ? "Rubuta abin da za a fassara..."
                      : "Saka job post..."
                  }
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  disabled={
                    loading || loadingConversation
                  }
                />

                <button
                  type="submit"
                  disabled={
                    loading ||
                    loadingConversation ||
                    !message.trim()
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  ↑
                </button>

              </form>

              <p className="mt-2 text-center text-[10px] text-slate-700">
                HausaAI na iya yin kuskure. Ka tabbatar da
                muhimman bayanai.
              </p>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default ChatPage;