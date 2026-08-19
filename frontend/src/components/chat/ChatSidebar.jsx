import logo from "../../assets/logo-navbar.png";
const ChatSidebar = ({
  user,
  conversations,
  loadingConversations,
  loading,
  loadingConversation,
  loggingOut,
  conversationId,
  sidebarOpen,
  setSidebarOpen,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onLogout,
}) => {
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
                  onSelectConversation(conversation._id)
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
                  onDeleteConversation(conversation._id)
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

  return (
    <>
      {/*DESKTOP SIDEBAR  */}

      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-slate-800/80 bg-slate-900/70 md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <img
            src={logo}
            alt="HausaAI"
            className="h-9 w-9 rounded-xl"
          />

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
            onClick={onNewChat}
            disabled={loading || loadingConversation}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium transition hover:bg-slate-700 disabled:opacity-50"
          >
            <span className="text-lg">+</span>
            Sabon Chat
          </button>
        </div>

        {/* Conversations title */}
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
              onClick={onLogout}
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
            {/* Mobile header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="HausaAI"
                  className="h-8 w-8 rounded-lg"
                />

                <span className="font-bold">HausaAI</span>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>

            {/* New Chat */}
            <div className="p-3">
              <button
                type="button"
                onClick={onNewChat}
                disabled={loading || loadingConversation}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
              >
                + Sabon Chat
              </button>
            </div>

            <ConversationList />
          </div>

          {/* Backdrop */}
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default ChatSidebar;
