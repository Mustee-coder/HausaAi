import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { getCurrentUser } from "./services/authApi";

// Blocks access until we know the user is logged in.
// Redirects to /login if not authenticated.
function ProtectedRoute({ user, checking, children }) {
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Ana bincike...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // On first load, check if there's already a valid session cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/chat" replace />
            ) : (
              <LoginPage onLoginSuccess={setUser} />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/chat" replace />
            ) : (
              <RegisterPage onRegisterSuccess={setUser} />
            )
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute user={user} checking={checking}>
              <ChatPage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />

        {/* Default: send to /chat (which redirects to /login if not authed) */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
