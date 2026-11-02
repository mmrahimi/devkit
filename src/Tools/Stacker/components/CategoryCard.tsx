import type { Category, Technology } from '../catalogue';
import { TechnologyOption } from './TechnologyOption';

type CategoryCardProps = {
  category: Category;
  selectedId?: string;
  disabled?: boolean;
  onToggle: (technology: Technology) => void;
};

export function CategoryCard({ category, selectedId, disabled = false, onToggle }: CategoryCardProps) {
  const titleId = `category-${category.id}`;

  return (
    <section className="min-w-0 rounded-xl border border-violet-200/10 bg-gradient-to-br from-slate-900 to-slate-900/80 p-5 shadow-lg shadow-black/10 transition-colors focus-within:border-violet-300/40 max-sm:p-4" aria-labelledby={titleId}>
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div><p className="mb-1 mt-0 text-xs font-bold tracking-wider text-slate-500">TECHNOLOGY CATEGORY</p><h3 id={titleId} className="m-0 text-lg font-semibold tracking-tight text-slate-100">{category.name}</h3></div>
      </div>
      <div className="mt-4 flex flex-wrap content-start justify-start gap-2" role="group" aria-label={`${category.name} technologies`}>
        {category.technologies.map((technology) => (
          <TechnologyOption key={technology.id} selected={selectedId === technology.id} disabled={disabled} technology={technology} onClick={() => onToggle(technology)} />
        ))}
      </div>
    </section>
  );
}
