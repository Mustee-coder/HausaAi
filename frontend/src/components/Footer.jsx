const Footer = () => {
  return (
    <footer className="border-t border-slate-900 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">HausaAI</span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-500">
            AI na masu magana da Hausa
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs text-slate-500">
          <a href="#features" className="transition hover:text-slate-300">
            Features
          </a>
          <a href="#about" className="transition hover:text-slate-300">
            Game da mu
          </a>
          <a
            href="mailto:magajimujittapha5@gmail.com"
            className="transition hover:text-slate-300"
          >
            Tuntuɓe mu
          </a>
        </div>

        <p className="text-xs text-slate-600">
          Mustee Digital Labs · Kano, Nigeria
        </p>
      </div>
    </footer>
  );
};

export default Footer;
