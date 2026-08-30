import type {
  FormEvent,
  ChangeEvent,
  RefObject,
} from "react";

interface Mode {
  id: string;
  label: string;
  icon: string;
}

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;

  mode: "chat" | "learn" | "translate" | "job";

  modes: {
    id: "chat" | "learn" | "translate" | "job";
    label: string;
    icon: string;
  }[];

  loading: boolean;
  loadingConversation: boolean;

  inputRef: React.RefObject<HTMLInputElement | null>;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  onModeChange: (
    newMode: "chat" | "learn" | "translate" | "job"
  ) => void;
}

const ChatInput = ({
  message,
  setMessage,
  mode,
  modes,
  loading,
  loadingConversation,
  inputRef,
  onSubmit,
  onModeChange,
}: ChatInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="shrink-0 px-3 pb-3 pt-2 sm:px-6 sm:pb-5">
      <div className="mx-auto max-w-3xl">

        {/* Mode selector */}
        <div className="mb-2 flex gap-1 overflow-x-auto">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onModeChange(item.id)}
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
          onSubmit={onSubmit}
          className="flex items-end gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl"
        >
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleChange}
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
            disabled={loading || loadingConversation}
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

        {/* Disclaimer */}
        <p className="mt-2 text-center text-[10px] text-slate-700">
          HausaAI na iya yin kuskure. Ka tabbatar da
          muhimman bayanai.
        </p>

      </div>
    </div>
  );
};

export default ChatInput;