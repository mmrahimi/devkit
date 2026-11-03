import type { Technology } from '../catalogue';
import { BrandMark } from './BrandMark';

type TechnologyOptionProps = {
  technology: Technology;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function TechnologyOption({ technology, selected, disabled = false, onClick }: TechnologyOptionProps) {
  return (
    <button
      aria-pressed={selected}
      className={`group relative flex h-34 w-full flex-col items-center justify-center gap-2 rounded-lg border p-2 text-center text-slate-300 transition duration-150 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-wait disabled:opacity-65 ${selected ? 'border-violet-300/80 bg-gradient-to-br from-violet-500/20 to-sky-500/15 text-violet-50 shadow-lg shadow-violet-950/30' : 'border-violet-100/10 bg-white/5'}`}
      disabled={disabled}
      onClick={onClick}
      title={`${selected ? 'Remove' : 'Select'} ${technology.name}`}
      type="button"
    >
      <span className="grid size-14 shrink-0 place-items-center"><BrandMark decorative technology={technology} /></span>
      <span className="line-clamp-3 max-w-full break-words overflow-hidden text-xs font-medium leading-tight">{technology.name}</span>
      <span className={`absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full border text-xs font-extrabold ${selected ? 'border-violet-300 bg-violet-400 text-slate-950 shadow-sm shadow-violet-300/50' : 'border-violet-100/20 text-transparent'}`} aria-hidden="true">{selected ? '✓' : ''}</span>
    </button>
  );
}
