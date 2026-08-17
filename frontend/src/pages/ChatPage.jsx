import { useEffect, useRef, useState } from "react";
import {
  sendMessage,
  getConversations,
  getConversationById,
  deleteConversation,
} from "../services/aiApi";
import { logoutUser } from "../services/authApi";

const MODES = [
  { id: "chat", label: "Chat" },
  { id: "learn", label: "Learn" },
  { id: "translate", label: "Translate" },
  { id: "job", label: "Job" },
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

  // Controls the mobile drawer — sidebar is always visible on desktop (md+),
  // but on small screens it's hidden by default and opens as an overlay.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Load saved conversations when ChatPage opens.
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

  const handleNewChat = () => {
    if (loading || loadingConversation) return;
    setMessages([]);
    setConversationId(null);
    setMode("chat");
    setMessage("");
    setSidebarOpen(false); // close drawer on mobile after action
  };

  const handleClearChat = () => {
    if (loading || loadingConversation) return;
    setMessages([]);
    setConversationId(null);
  };

  const handleModeChange = (newMode) => {
    if (loading || loadingConversation || newMode === mode) return;
    setMode(newMode);
    setMessages([]);
    setConversationId(null);
    setMessage("");
  };

  const handleSelectConversation = async (id) => {
    if (loading || loadingConversation || mode !== "chat" || id === conversationId) {
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
      setSidebarOpen(false); // close drawer on mobile after selecting
    } catch (error) {
      console.error("Load conversation error:", error);
    } finally {
      setLoadingConversation(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    if (loading || loadingConversation) return;

    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));

      if (conversationId === id) {
        setMessages([]);
        setConversationId(null);
      }
    } catch (error) {
      console.error("Delete conversation error:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();
    if (!userMessage || loading) return;

    const history = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const data = await sendMessage(userMessage, mode, history, conversationId);

      if (mode === "chat" && data.conversationId) {
        setConversationId(data.conversationId);
        const updatedConversations = await getConversations();
        setConversations(updatedConversations || []);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "An samu matsala wajen haɗawa da HausaAI. Ka sake gwadawa." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const ConversationList = () => (
    <div className="flex-1 overflow-y-auto p-3">
      {loadingConversations ? (
        <p className="px-2 py-3 text-sm text-slate-500">Ana loda chats...</p>
      ) : conversations.length === 0 ? (
        <p className="px-2 py-3 text-sm text-slate-500">Babu tsoffin conversations.</p>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`group flex items-center gap-2 rounded-xl p-2 transition ${
                conversationId === conversation._id ? "bg-slate-800" : "hover:bg-slate-800/70"
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelectConversation(conversation._id)}
                disabled={loading || loadingConversation}
                className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
              >
                <p className="truncate text-sm text-slate-200">
                  {conversation.title || "New Conversation"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteConversation(conversation._id)}
                disabled={loading || loadingConversation}
                className="rounded-lg px-2 py-1 text-xs text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 disabled:cursor-not-allowed md:opacity-0"
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

  return (
    <div className="flex h-dvh bg-slate-950 text-white">
      {/* Desktop sidebar — always visible on md+ */}
      <aside className="hidden w-72 flex-col border-r border-slate-800 bg-slate-900 md:flex">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="font-semibold">Conversations</h2>
          <button
            type="button"
            onClick={handleNewChat}
            disabled={loading || loadingConversation}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + New Chat
          </button>
        </div>
        <ConversationList />
      </aside>

      {/* Mobile drawer — overlay + backdrop, only rendered when open */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="flex w-72 flex-col border-r border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <h2 className="font-semibold">Conversations</h2>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="p-3">
              <button
                type="button"
                onClick={handleNewChat}
                disabled={loading || loadingConversation}
                className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + New Chat
              </button>
            </div>
            <ConversationList />
          </div>

          {/* Backdrop — click to close */}
          <div
            className="flex-1 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Chat */}
      <main className="flex min-w-0 flex-1 flex-col p-4">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Hamburger — mobile only */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 md:hidden"
                aria-label="Open conversations"
              >
                ☰
              </button>

              <div className="min-w-0">
                <h1 className="text-xl font-bold sm:text-2xl">HausaAI</h1>
                <p className="truncate text-xs text-slate-400 sm:text-sm">
                  {user?.name ? `Barka da zuwa, ${user.name}` : "AI assistant na masu magana da Hausa"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  disabled={loading || loadingConversation}
                  className="rounded-xl border border-slate-700 px-2 py-2 text-xs text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-xl border border-slate-700 px-2 py-2 text-xs text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
              >
                {loggingOut ? "..." : "Logout"}
              </button>
            </div>
          </header>

          {/* Mode switcher */}
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleModeChange(item.id)}
                disabled={loading || loadingConversation}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  mode === item.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {loadingConversation && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center text-sm text-slate-400">
                Ana loda conversation...
              </div>
            )}

            {messages.length === 0 && !loadingConversation && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
                <h2 className="mb-2 text-xl font-semibold">Barka da zuwa HausaAI</h2>
                <p className="text-slate-400">Ka rubuta tambayarka domin mu fara.</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user" ? "bg-blue-600" : "bg-slate-800"
                  }`}
                >
                  <p className="mb-1 text-xs font-semibold text-slate-300">
                    {msg.role === "user" ? "Kai" : "HausaAI"}
                  </p>
                  <p className="whitespace-pre-wrap leading-7">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-800 px-4 py-3">
                  <p className="text-sm text-slate-400">HausaAI yana tunani...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Rubuta saƙonka..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-slate-500"
              disabled={loading || loadingConversation}
            />
            <button
              type="submit"
              disabled={loading || loadingConversation || !message.trim()}
              className="rounded-xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
            >
              {loading ? "..." : "Aika"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
