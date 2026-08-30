const Footer = () => {
  return (
    <footer className="border-t border-slate-900 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">

        {/* Main Footer */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">

          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="text-base font-bold text-white">
                HausaAI
              </span>

              <span className="text-xs text-slate-700">
                ·
              </span>

              <span className="text-xs text-slate-500">
                AI na masu magana da Hausa
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              AI assistant da aka gina domin Hausa-speaking users.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
            <a
              href="#features"
              className="transition hover:text-slate-300"
            >
              Features
            </a>

            <a
              href="#about"
              className="transition hover:text-slate-300"
            >
              Game da HausaAI
            </a>

            <a
              href="mailto:magajimujittapha5@gmail.com"
              className="transition hover:text-slate-300"
            >
              Tuntuɓe mu
            </a>
          </div>

          {/* Company */}
          <div className="text-center sm:text-right">
            <p className="text-xs font-medium text-slate-400">
              Mustee Digital Labs
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Kano, Nigeria 🇳🇬
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-900" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Mustee Digital Labs. All rights reserved.
          </p>

          <p className="text-xs text-slate-700">
            Built with ❤️ for Hausa-speaking communities.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;