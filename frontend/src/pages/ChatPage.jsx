import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../services/aiApi";
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
  const [loggingOut, setLoggingOut] = useState(false);

  const messagesEndRef = useRef(null);

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

  const handleClearChat = () => {
    if (loading) return;
    setMessages([]);
    setConversationId(null);
  };

  // Switching mode starts a fresh context — prevents Chat history/
  // conversationId from leaking into Translate/Job/Learn requests.
  const handleModeChange = (newMode) => {
    if (loading || newMode === mode) return;
    setMode(newMode);
    setMessages([]);
    setConversationId(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();

    if (!userMessage || loading) return;

    // Only "learn" mode sends frontend-managed history (chat mode's
    // history is pulled server-side from the DB via conversationId).
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
      const data = await sendMessage(userMessage, mode, history, conversationId);

      // Chat mode returns a conversationId — keep it so follow-up
      // messages stay in the same persisted conversation.
      if (mode === "chat" && data.conversationId) {
        setConversationId(data.conversationId);
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
          content: "An samu matsala wajen haɗawa da HausaAI. Ka sake gwadawa.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white p-4">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">HausaAI</h1>
            <p className="text-sm text-slate-400">
              {user?.name ? `Barka da zuwa, ${user.name}` : "AI assistant na masu magana da Hausa"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                disabled={loading}
                className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear Chat
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
              disabled={loading}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                mode === item.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Messages — scrollable, fills remaining space instead of a fixed min-height */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
              <h2 className="mb-2 text-xl font-semibold">Barka da zuwa HausaAI</h2>
              <p className="text-slate-400">Ka rubuta tambayarka domin mu fara.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
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

          {/* Scroll anchor — sits once, after all messages */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input — stays right below messages, no longer glued to viewport bottom */}
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
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "..." : "Aika"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatPage;
