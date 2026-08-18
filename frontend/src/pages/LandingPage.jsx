import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      <Navbar />

      {/* Hero */}
      <section className="relative">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center px-6 text-center">

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            AI na masu magana da Hausa
          </div>

          {/* Heading */}
          <h2 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            AI da yake
            <span className="block text-blue-500">
              fahimtar Hausa.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            HausaAI wani AI assistant ne da aka tsara domin
            taimaka wa masu magana da Hausa wajen koyo,
            fassara, samun bayanai da taimakon aiki.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

            <Link
              to="/chat"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Fara Chat →
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-slate-700 bg-slate-900/50 px-7 py-3.5 font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              Duba Features
            </a>

          </div>

          {/* Trust text */}
          <p className="mt-7 text-xs text-slate-600">
            Built for Hausa-speaking users in Nigeria 🇳🇬
          </p>

        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-6 pb-24"
      >
        <div className="mb-10 text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Features
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Abin da HausaAI zai iya
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Tools daban-daban da aka haɗa domin sauƙaƙa
            samun ilimi da amfani da AI cikin Hausa.
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <Feature
            icon="💬"
            title="Chat"
            description="Yi magana da AI kuma samu amsoshi cikin Hausa."
          />

          <Feature
            icon="📚"
            title="Learn"
            description="Koyi programming da sauran topics cikin sauƙi."
          />

          <Feature
            icon="🌍"
            title="Translate"
            description="Fassara tsakanin Hausa da English cikin sauƙi."
          />

          <Feature
            icon="💼"
            title="Job"
            description="Fahimci job descriptions kuma shirya application."
          />

        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-t border-slate-900 px-6 py-24"
      >
        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold text-blue-400">
            GAME DA HAUSAAI
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            AI ya kamata ya kasance ga kowa.
          </h3>

          <p className="mt-5 leading-8 text-slate-400">
            HausaAI yana nufin rage matsalar language barrier
            ta hanyar samar da AI assistant wanda zai iya
            sadarwa da masu magana da Hausa cikin harshen da
            suka fi fahimta.
          </p>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-blue-500/20 bg-blue-500/10 p-10 text-center">

          <h3 className="text-3xl font-bold">
            Ka shirya ka gwada HausaAI?
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Fara magana da HausaAI yanzu.
          </p>

          <Link
            to="/chat"
            className="mt-7 inline-block rounded-xl bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-500"
          >
            Fara amfani da HausaAI →
          </Link>

        </div>
      </section>

      <Footer />

    </main>
  );
};

const Feature = ({ icon, title, description }) => {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-900">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-xl transition group-hover:bg-blue-500/10">
        {icon}
      </div>

      <h4 className="text-lg font-semibold">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

    </div>
  );
};

export default LandingPage;
