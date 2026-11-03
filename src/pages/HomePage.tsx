import { SiteHeader } from '../components/SiteHeader';

const eyebrow = 'flex items-center gap-2 text-xs font-bold tracking-widest text-violet-300';

export function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-9 max-md:px-6 max-sm:px-4">
        <SiteHeader currentPage="home" />

        <section className="relative flex min-h-128 flex-col items-start justify-center py-16 max-md:min-h-112 max-sm:min-h-108" aria-labelledby="home-title">
          <p className={`${eyebrow} mb-6`}><span className="h-px w-5 bg-gradient-to-r from-violet-400 to-sky-400" /> THE DEVKIT WORKBENCH</p>
          <h1 id="home-title" className="m-0 text-6xl font-bold leading-none tracking-tight text-white max-md:text-6xl max-sm:text-5xl">Useful little tools.<br /><span className="bg-gradient-to-r from-violet-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">Big ideas, moving.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400 max-sm:text-sm">A growing collection of focused tools for the moments that make building easier.</p>
          <a className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-violet-200 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300" href="#tools">Explore the toolkit <span className="grid size-7 place-items-center rounded-full border border-violet-300/30 transition group-hover:translate-y-1" aria-hidden="true">↓</span></a>
          <div className="pointer-events-none absolute right-16 top-1/2 hidden h-56 w-1 -translate-y-1/2 bg-gradient-to-b from-transparent via-violet-400/60 to-transparent md:block" aria-hidden="true" />
        </section>

        <section className="pb-20 max-sm:pb-14" id="tools" aria-labelledby="tools-title">
          <div className="mb-6">
            <p className={`${eyebrow} mb-2`}>THE TOOLKIT</p>
            <h2 id="tools-title" className="m-0 text-2xl font-semibold tracking-tight text-slate-100">Pick a tool. Get to work.</h2>
          </div>

          <a
            className="group relative z-10 grid min-h-72 w-full cursor-pointer grid-cols-2 overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 text-inherit no-underline shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-violet-300/40 hover:shadow-2xl hover:shadow-violet-950/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 max-sm:grid-cols-1"
            href="/tools/stacker"
            aria-label="Open Stacker tool"
          >
            <div className="pointer-events-none relative grid min-h-72 place-items-center overflow-hidden border-r border-violet-300/10 bg-gradient-to-br from-violet-950/50 via-slate-900 to-sky-950/40 max-sm:min-h-52 max-sm:border-b max-sm:border-r-0" aria-hidden="true">
              <span className="grid size-24 place-items-center rounded-2xl border border-violet-200/30 bg-slate-900/70 shadow-2xl shadow-violet-500/20 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-violet-400/30">
                <svg className="size-16 drop-shadow-lg" viewBox="0 0 96 96" fill="none">
                  <path d="M48 9v8m0 20v8m0 20v8" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
                  <rect x="32" y="13" width="32" height="18" rx="6" fill="#a78bfa" />
                  <rect x="20" y="41" width="56" height="18" rx="6" fill="#60a5fa" />
                  <rect x="8" y="69" width="80" height="18" rx="6" fill="#5eead4" />
                  <path d="M40 22h16m-28 28h40M18 78h60" stroke="#0f172a" strokeOpacity=".65" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <span className="absolute bottom-7 text-xs font-bold tracking-widest text-slate-400">CHOOSE · CONNECT · CREATE</span>
            </div>
            <div className="pointer-events-none flex flex-col items-start justify-center p-10 max-md:p-7 max-sm:p-6">
              <div className="flex w-full items-center justify-between"><span className="text-xs font-bold tracking-widest text-violet-300">ARCHITECTURE</span><span className="text-2xl text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-200">↗</span></div>
              <h3 className="mb-2 mt-5 text-4xl font-semibold tracking-tight text-white max-sm:text-3xl">Stacker</h3>
              <p className="m-0 max-w-sm text-sm leading-6 text-slate-400">Choose the technologies behind your next idea and turn them into a diagram you can share.</p>
              <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-violet-200">Open Stacker <span aria-hidden="true">→</span></span>
            </div>
          </a>

          <a
            className="group relative z-10 mt-5 grid min-h-64 w-full cursor-pointer grid-cols-2 overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 text-inherit no-underline shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-sky-300/40 hover:shadow-2xl hover:shadow-blue-950/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300 max-sm:grid-cols-1"
            href="/tools/markpad"
            aria-label="Open Markpad tool"
          >
            <div className="pointer-events-none relative grid min-h-64 place-items-center overflow-hidden border-r border-sky-300/10 bg-gradient-to-br from-blue-950/50 via-slate-900 to-violet-950/40 max-sm:min-h-48 max-sm:border-b max-sm:border-r-0" aria-hidden="true">
              <span className="grid size-20 place-items-center rounded-2xl border border-sky-200/30 bg-slate-900/70 shadow-2xl shadow-blue-500/20 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-sky-500/30">
                <svg className="size-14 drop-shadow-lg" viewBox="0 0 80 80" fill="none">
                  <path d="M20 10h27l14 14v46H20V10Z" fill="#172554" stroke="#7dd3fc" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M47 10v15h14" stroke="#7dd3fc" strokeWidth="3" strokeLinejoin="round" />
                  <path d="m29 39 2-9m10 9 2-9m-17 5h20m-21 9h20" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
                  <path d="M29 53h17m-17 8h12" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                  <path d="m49 54 8-8 6 6-8 8-8 2 2-8Z" fill="#38bdf8" stroke="#bae6fd" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="absolute bottom-6 font-mono text-xs tracking-widest text-slate-400"># WRITE · PREVIEW</span>
            </div>
            <div className="pointer-events-none flex flex-col items-start justify-center p-10 max-md:p-7 max-sm:p-6">
              <div className="flex w-full items-center justify-between"><span className="text-xs font-bold tracking-widest text-sky-300">MARKDOWN</span><span className="text-2xl text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-200">↗</span></div>
              <h3 className="mb-2 mt-5 text-4xl font-semibold tracking-tight text-white max-sm:text-3xl">Markpad</h3>
              <p className="m-0 max-w-sm text-sm leading-6 text-slate-400">Write Markdown, preview the rendered document, and copy the original text.</p>
              <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-sky-200">Open Markpad <span aria-hidden="true">→</span></span>
            </div>
          </a>

          <div className="mt-7 flex items-center gap-3 text-sm text-slate-500">💜<span className="text-lg text-violet-400"></span><span>More tools are taking shape.</span><span className="h-px w-12 bg-gradient-to-r from-violet-500/40 to-transparent" /></div>
        </section>

        <footer className="flex min-h-16 items-center justify-between border-t border-violet-200/10 text-xs text-slate-500"><span>Small utilities for people who make things.</span><span>DEVKIT © 2026</span></footer>
      </div>
    </main>
  );
}
