import type { RefObject } from 'react';
import { getSelectedTechnologies } from '../selection';
import type { Selections } from '../catalogue';
import { BrandMark } from './BrandMark';

type StackDiagramProps = {
  selections: Selections;
  diagramRef?: RefObject<HTMLDivElement | null>;
};

export function StackDiagram({ selections, diagramRef }: StackDiagramProps) {
  const items = getSelectedTechnologies(selections);

  return (
    <div className="max-w-full overflow-x-auto" aria-label="Architecture diagram; scroll horizontally to see the full stack">
      <div className="w-max min-w-min rounded-lg border border-violet-300/20 bg-slate-950 p-6 text-slate-100" ref={diagramRef}>
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-violet-300/30 bg-gradient-to-br from-violet-500/20 to-sky-500/10" aria-hidden="true">
            <svg className="size-5 fill-none stroke-violet-300 stroke-2" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="m8.4 10.9 7.2-3.8M8.4 13.1l7.2 3.8" /></svg>
          </div>
          <div>
            <p className="mb-1 mt-0 text-xs font-bold tracking-wider text-slate-500">STACKER · ARCHITECTURE BLUEPRINT</p>
            <p className="m-0 text-base font-semibold tracking-tight text-slate-100">Your application stack</p>
          </div>
        </div>

        <div className="mt-5 flex min-h-32 w-max items-center" aria-label="Selected technologies in catalogue order">
          {items.map(({ categoryName, technology }, index) => (
            <div className="flex items-center" key={technology.id}>
              <article className="flex min-h-36 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-violet-200/20 bg-gradient-to-br from-slate-800 to-slate-900 p-3 text-center shadow-lg shadow-black/20">
                <div className="grid size-14 shrink-0 place-items-center"><BrandMark technology={technology} compact /></div>
                <span className="max-w-36 text-sm font-semibold leading-tight text-slate-100">{technology.name}</span>
                <span className="max-w-36 text-xs font-semibold leading-tight text-slate-400">{categoryName}</span>
              </article>
              {index < items.length - 1 && (
                <span className="grid w-10 shrink-0 place-items-center text-violet-400 drop-shadow-md" role="img" aria-label="Next technology in the stack"><svg className="size-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></span>
              )}
            </div>
          ))}
        </div>

        <p className="mb-0 mt-4 text-xs text-slate-500">A simple flow through your chosen tools. Actual connections depend on your application.</p>
      </div>
    </div>
  );
}
