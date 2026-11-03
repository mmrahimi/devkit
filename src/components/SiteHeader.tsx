type SiteHeaderProps = { currentPage: 'home' | 'stacker' | 'markpad' };

export function SiteHeader({ currentPage }: SiteHeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-violet-200/10">
      <a className="inline-flex items-center gap-3 text-lg font-extrabold tracking-tight text-violet-50 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300" href="/" aria-label="DevKit home">
        <span className="grid size-7 -rotate-6 grid-cols-2 gap-1" aria-hidden="true">
          <i className="rounded bg-gradient-to-br from-violet-400 to-violet-800 shadow-lg shadow-violet-500/20" />
          <i className="rounded bg-gradient-to-br from-sky-300 to-blue-700 shadow-lg shadow-blue-500/20" />
          <i className="rounded bg-gradient-to-br from-teal-300 to-cyan-800 shadow-lg shadow-cyan-500/20" />
          <i className="rounded bg-gradient-to-br from-violet-300 to-indigo-800 shadow-lg shadow-violet-500/20" />
        </span>
        <span>devkit<span className="text-violet-400">.</span></span>
      </a>
      {currentPage !== 'home' && (
        <nav className="flex items-center gap-3" aria-label="Main navigation">
          <a className="text-sm font-semibold text-slate-400 no-underline transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300" href="/">Tools</a>
          <span className="text-sm text-slate-600">/</span>
          <span className="text-sm font-semibold text-white">{currentPage === 'stacker' ? 'Stacker' : 'Markpad'}</span>
        </nav>
      )}
    </header>
  );
}
