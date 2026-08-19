import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";
import logo from "../assets/logo-navbar.png";

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
      const data = await registerUser(
        name.trim(),
        email.trim(),
        password
      );

      onRegisterSuccess?.(data.user);
      navigate("/chat");
    } catch (err) {
      setError(
        err.message ||
          "An samu matsala wajen yin rijista. Ka sake gwadawa."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3"
          >
            <img
              src={logo}
              alt="HausaAI"
              className="h-11 w-11 rounded-xl"
            />

            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight">
                HausaAI
              </h1>

              <p className="text-xs text-slate-500">
                AI na Hausa
              </p>
            </div>
          </Link>

          <h2 className="mt-8 text-2xl font-bold sm:text-3xl">
            Ƙirƙiri asusunka
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Yi rijista domin fara amfani da HausaAI.
          </p>
        </div>

        {/* Register Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
        >

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400"
            >
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Suna
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sunanka"
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div className="mt-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Akalla haruffa 6"
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-slate-600">
              Password ya kasance akalla haruffa 6.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Ana yin rijista...
              </>
            ) : (
              "Yi rijista"
            )}
          </button>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Ka riga ka da asusu?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 transition hover:text-blue-300 hover:underline"
            >
              Shiga
            </Link>
          </p>
        </form>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-slate-500 transition hover:text-slate-300"
          >
            ← Komawa homepage
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-slate-600">
          HausaAI · AI na masu magana da Hausa
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
