import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
            H
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">
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
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
        >
          Fara amfani
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;