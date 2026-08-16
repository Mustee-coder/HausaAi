import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi";

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Ka shigar da email da password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email.trim(), password);
      onLoginSuccess?.(data.user);
      navigate("/chat");
    } catch (err) {
      setError(err.message || "An samu matsala wajen shiga. Ka sake gwadawa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">HausaAI</h1>
          <p className="text-sm text-slate-400">Shiga asusun ka</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Ana shiga..." : "Shiga"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Ba ka da asusu?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Yi rijista
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
