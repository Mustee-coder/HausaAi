import { Link } from "react-router-dom";
import logo from "../assets/logo-navbar.png";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="HausaAI Home"
        >
          <img
            src={logo}
            alt="HausaAI"
            className="h-10 w-10 rounded-xl shadow-lg shadow-blue-600/20"
          />

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              HausaAI
            </h1>

            <p className="text-[11px] text-slate-500">
              AI na Hausa
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#about"
            className="transition hover:text-white"
          >
            Game da HausaAI
          </a>
        </div>

        {/* CTA */}
        <Link
          to="/chat"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:-translate-y-0.5 hover:bg-blue-500"
        >
          Fara amfani →
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;