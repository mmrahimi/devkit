import { useEffect, useRef, useState } from 'react';
import { SiteHeader } from '../../../components/SiteHeader';
import { categories, type CategoryId, type Selections, type TechnologyId } from '../catalogue';
import { CategoryCard } from '../components/CategoryCard';
import { StackDiagram } from '../components/StackDiagram';
import { exportDiagramAsPng } from '../png-export';
import { hasSelection, toggleTechnology } from '../selection';

export function StackerPage() {
  const [selections, setSelections] = useState<Selections>({});
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const diagramRef = useRef<HTMLDivElement>(null);
  const hasSelections = hasSelection(selections);

  function clearSelections() {
    setSelections({});
    setExportError('');
  }

  function handleExport() {
    if (!hasSelection(selections) || exporting) return;
    setExportError('');
    setExporting(true);
  }

  useEffect(() => {
    if (!exporting) return undefined;

    const diagram = diagramRef.current;
    if (!diagram) return undefined;

    let isCurrentExport = true;
    exportDiagramAsPng(diagram)
      .catch(() => {
        if (isCurrentExport) setExportError('The PNG could not be created. Please try again.');
      })
      .finally(() => {
        if (isCurrentExport) setExporting(false);
      });

    return () => { isCurrentExport = false; };
  }, [exporting]);

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-9 max-md:px-6 max-sm:px-4">
        <SiteHeader currentPage="stacker" />

        <section className="py-16 pb-8 max-sm:pt-12" aria-labelledby="stacker-title">
          <p className="mb-6 flex items-center gap-2 text-xs font-bold tracking-widest text-violet-300 max-sm:mb-4"><span className="h-px w-5 bg-gradient-to-r from-violet-400 to-sky-400" /> DEVKIT TOOL</p>
          <div className="flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-4">
            <div>
              <h1 id="stacker-title" className="m-0 text-6xl font-bold leading-none tracking-tight text-white max-sm:text-5xl">Stacker<span className="text-violet-400">.</span></h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-400 max-sm:text-sm">Shape a stack for your next idea. Pick one tool in any category; leave the rest open.</p>
            </div>
          </div>
        </section>

        <div className="sticky top-0 z-40 flex items-center justify-between gap-5 border-y border-violet-200/10 bg-slate-950/95 p-3 backdrop-blur-lg max-sm:-mx-2 max-sm:flex-col max-sm:items-start max-sm:gap-3">
          <p className="m-0 text-sm text-slate-400 max-sm:text-xs">Choose what feels right. You can change any selection with one click.</p>
          <button className="inline-flex min-h-10 items-center gap-2 rounded-md border border-violet-100/20 bg-white/5 px-3 text-xs font-semibold text-slate-300 transition hover:border-violet-300/50 hover:bg-violet-400/10 hover:text-violet-100 disabled:cursor-default disabled:opacity-45" disabled={!hasSelections || exporting} onClick={clearSelections} type="button">
            <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
            Clear selections
          </button>
        </div>

        <section className="grid grid-cols-2 gap-4 py-3 pb-14 max-md:gap-3 max-sm:grid-cols-1 max-sm:gap-3 max-sm:pb-12" aria-label="Technology categories">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              disabled={exporting}
              onToggle={(technology) => setSelections((current) => toggleTechnology(
                current,
                category.id as CategoryId,
                technology.id as TechnologyId,
              ))}
              selectedId={selections[category.id]}
            />
          ))}
        </section>

        {exporting && (
          <div className="pointer-events-none fixed left-0 top-0 w-max -translate-x-full" aria-hidden="true">
            <StackDiagram diagramRef={diagramRef} selections={selections} />
          </div>
        )}

        <section className="mb-16 flex items-center justify-between gap-6 rounded-xl border border-violet-200/20 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-slate-900 p-6 max-sm:mb-12 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 max-sm:p-5" aria-label="Export your selected stack">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-violet-300">TAKE IT WITH YOU</p>
            <p className="m-0 text-sm text-slate-400 max-sm:text-xs">{hasSelections ? 'Your stack diagram is ready to download.' : 'Choose at least one technology to enable PNG export.'}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 max-sm:items-stretch">
            <button className="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg border border-violet-300/70 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-45 disabled:grayscale max-sm:w-full" disabled={!hasSelections || exporting} onClick={handleExport} type="button">
              <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" /></svg>
              {exporting ? 'Preparing PNG...' : 'Export PNG'}
              {!exporting && <span aria-hidden="true">↗</span>}
            </button>
            {exportError && <p className="m-0 text-sm text-red-300" role="alert">{exportError}</p>}
          </div>
        </section>

        <footer className="flex min-h-16 items-center justify-between border-t border-violet-200/10 text-xs text-slate-500"><span>Made for stacking up your favorite tools</span><a className="text-violet-300 no-underline hover:text-violet-100" href="/">← Back to all tools</a></footer>
      </div>
    </main>
  );
}
