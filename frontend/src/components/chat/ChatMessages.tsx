import type { CSSProperties } from "react";
import logo from "../../assets/logo-navbar.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface User {
  _id?: string;
  name?: string;
  email?: string;
}

type ModeId = "chat" | "learn" | "translate" | "job";

interface ChatMode {
  id: ModeId;
  label: string;
  icon: string;
}

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  loadingConversation: boolean;
  user: User | null;
  mode: ModeId;
  modes: ChatMode[];
  onModeChange: (newMode: ModeId) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}
const ChatMessages = ({
  messages,
  loading,
  loadingConversation,
  user,
  mode,
  modes,
  onModeChange,
  messagesEndRef,
}: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">

        {/* Loading conversation */}
        {loadingConversation && (
          <div className="mb-6 text-center text-sm text-slate-500">
            Ana loda conversation...
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !loadingConversation && (
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">

            <img
              src={logo}
              alt="HausaAI"
              className="mb-6 h-16 w-16 rounded-2xl shadow-lg shadow-blue-600/20"
            />

            <h1 className="text-2xl font-bold sm:text-3xl">
              Barka da zuwa HausaAI
            </h1>

            <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
              AI assistant da aka gina domin
              masu magana da Hausa.
            </p>

            {/* Mode cards */}
            <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3">
              {modes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onModeChange(item.id)}
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

                {/* AI Avatar */}
                {!isUser && (
                  <img
                    src={logo}
                    alt="HausaAI"
                    className="h-8 w-8 shrink-0 rounded-lg"
                  />
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

                {/* User Avatar */}
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

          {/* AI Loading */}
          {loading && (
            <div className="flex gap-3">
              <img
                src={logo}
                alt="HausaAI"
                className="h-8 w-8 shrink-0 rounded-lg"
              />

              <div className="rounded-2xl rounded-bl-md bg-slate-900 px-5 py-4">
                <div className="flex items-center gap-1.5">

                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />

                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                    style={
                      {
                        animationDelay: "150ms",
                      } as CSSProperties
                    }
                  />

                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                    style={
                      {
                        animationDelay: "300ms",
                      } as CSSProperties
                    }
                  />

                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;