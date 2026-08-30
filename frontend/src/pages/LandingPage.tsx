import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

interface StepProps {
  number: string;
  title: string;
  description: string;
}

interface UseCaseProps {
  icon: string;
  title: string;
  description: string;
}

const LandingPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute left-10 top-1/2 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            AI domin masu magana da Hausa
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            AI da yake
            <span className="block text-blue-500">
              fahimtar Hausa.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            HausaAI AI assistant ne da aka gina domin taimaka wa
            masu magana da Hausa wajen koyo, fassara, fahimtar
            bayanai da samun taimako kan ayyuka.
          </p>

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

          <div className="mt-8 flex flex-col items-center gap-2 text-xs text-slate-500">
            <p>
              An gina shi domin masu magana da Hausa a Najeriya 🇳🇬
            </p>

            <p className="text-slate-600">
              Powered by Meta Llama
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-6 pb-24"
      >
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Features
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Abin da HausaAI zai iya
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            An haɗa tools daban-daban domin sauƙaƙa koyo,
            fassara, fahimtar bayanai da amfani da AI cikin Hausa.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon="💬"
            title="Chat"
            description="Yi magana da AI kuma samu amsoshi cikin Hausa cikin sauƙi."
          />

          <Feature
            icon="📚"
            title="Learn"
            description="Koyi programming da sauran topics ta hanyar bayani mai sauƙi."
          />

          <Feature
            icon="🌍"
            title="Translate"
            description="Fassara tsakanin Hausa da English tare da kiyaye ma'anar rubutu."
          />

          <Feature
            icon="💼"
            title="Job"
            description="Fahimci job descriptions da abubuwan da ake nema a aikin."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-slate-900 bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Yadda yake aiki
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Sauƙi daga tambaya zuwa amsa
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Ba sai ka iya English sosai ba kafin ka fara amfani
              da AI.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Ka tambaya"
              description="Rubuta tambayarka cikin Hausa kamar yadda kake magana."
            />

            <Step
              number="02"
              title="HausaAI ya fahimta"
              description="AI yana sarrafa tambayarka sannan ya fahimci abin da kake nema."
            />

            <Step
              number="03"
              title="Ka samu amsa"
              description="Za ka samu amsa cikin Hausa mai sauƙin fahimta."
            />
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section
        id="about"
        className="border-t border-slate-900 px-6 py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Matsalar
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Language barrier na iya hana mutane amfani da AI
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              Yawancin AI tools suna dogaro sosai da English.
              Wannan na iya zama ƙalubale ga mutane da yawa waɗanda
              Hausa ce harshensu da suka fi fahimta.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Maganin HausaAI
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              AI cikin harshen da mutane suka fi fahimta
            </h3>

            <p className="mt-4 leading-8 text-slate-400">
              HausaAI an gina shi domin rage language barrier ta
              hanyar samar da AI assistant da ke sadarwa da masu
              magana da Hausa cikin harshensu.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                Hausa
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                AI
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                Llama
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                Nigeria
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="border-t border-slate-900 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Amfani
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Abubuwan da za ka iya yi da HausaAI
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <UseCase
              icon="🎓"
              title="Koyo"
              description="Koyi programming da sauran topics cikin Hausa."
            />

            <UseCase
              icon="🌐"
              title="Fassara"
              description="Sauƙaƙa fahimtar rubutun Hausa da English."
            />

            <UseCase
              icon="💼"
              title="Aiki"
              description="Fahimci job descriptions da bayanan ayyuka."
            />

            <UseCase
              icon="💡"
              title="Tambayoyi"
              description="Tambayi HausaAI tambayoyin da kake son fahimta."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 pt-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-blue-500/20 bg-blue-500/10 p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Fara yanzu
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Ka shirya ka gwada HausaAI?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Fara magana da HausaAI kuma ka ga yadda AI zai iya
              taimaka maka cikin Hausa.
            </p>

            <Link
              to="/chat"
              className="mt-7 inline-block rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Fara amfani da HausaAI →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

/* FEATURE COMPONENT */

const Feature = ({
  icon,
  title,
  description,
}: FeatureProps) => {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-900">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-xl transition group-hover:bg-blue-500/10">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
};

/* HOW IT WORKS */

const Step = ({
  number,
  title,
  description,
}: StepProps) => {
  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-7">
      <span className="text-sm font-bold text-blue-500">
        {number}
      </span>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
};

/* USE CASE */

const UseCase = ({
  icon,
  title,
  description,
}: UseCaseProps) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-blue-500/30 hover:bg-slate-900/70">
      <div className="text-2xl">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
};

export default LandingPage;