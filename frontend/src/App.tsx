import { useEffect, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { getCurrentUser } from "./services/authApi";

interface User {
  _id?: string;
  name?: string;
  email?: string;
}

interface ProtectedRouteProps {
  user: User | null;
  checking: boolean;
  children: ReactNode;
}

function ProtectedRoute({
  user,
  checking,
  children,
}: ProtectedRouteProps) {
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
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

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
        {/* Home */}
        <Route
          path="/"
          element={
            checking ? (
              <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
                Ana bincike...
              </div>
            ) : user ? (
              <Navigate to="/chat" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login */}
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

        {/* Register */}
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

        {/* Protected Chat */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute
              user={user}
              checking={checking}
            >
              <ChatPage
                user={user}
                onLogout={() => setUser(null)}
              />
            </ProtectedRoute>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;