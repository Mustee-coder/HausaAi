import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";

const RegisterPage = ({ onRegisterSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Ka cika dukkan filayen.");
      return;
    }

    if (password.length < 6) {
      setError("Password dole ya kasance akalla haruffa 6.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(name.trim(), email.trim(), password);
      onRegisterSuccess?.(data.user);
      navigate("/chat");
    } catch (err) {
      setError(err.message || "An samu matsala wajen yin rijista. Ka sake gwadawa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">HausaAI</h1>
          <p className="text-sm text-slate-400">Ƙirƙiri sabon asusu</p>
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
            <label className="mb-1 block text-sm text-slate-400">Suna</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Sunanka"
              disabled={loading}
            />
          </div>

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
              placeholder="Akalla haruffa 6"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Ana yin rijista..." : "Yi rijista"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Ka riga ka da asusu?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Shiga
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
