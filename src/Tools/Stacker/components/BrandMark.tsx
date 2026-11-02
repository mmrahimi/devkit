import type { CustomMark, Technology } from '../catalogue';

type BrandMarkProps = {
  technology: Technology;
  compact?: boolean;
  decorative?: boolean;
};

export function BrandMark({ technology, compact = false, decorative = false }: BrandMarkProps) {
  const markColors: Record<CustomMark, string> = {
    typeorm: 'text-violet-300', eloquent: 'text-emerald-300', sqlalchemy: 'text-blue-300',
    aws: 'text-amber-300', azure: 'text-sky-300', memcached: 'text-fuchsia-300',
    rest: 'text-teal-300', grpc: 'text-indigo-300', sessions: 'text-blue-300',
    jwt: 'text-amber-300', playwright: 'text-emerald-300', phpunit: 'text-violet-300',
  };
  if (technology.icon) {
    return (
      <svg
        aria-hidden={decorative}
        aria-label={decorative ? undefined : technology.name}
        className={`block drop-shadow-md ${compact ? 'size-11' : 'size-12'}`}
        role={decorative ? undefined : 'img'}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={technology.icon.path} fill={`#${technology.icon.hex}`} />
      </svg>
    );
  }

  if (!technology.mark) return null;

  return (
    <svg
      aria-hidden={decorative}
      aria-label={decorative ? undefined : technology.name}
      className={`block fill-none stroke-current stroke-2 drop-shadow-md ${markColors[technology.mark]} ${compact ? 'size-12' : 'size-14'}`}
      role={decorative ? undefined : 'img'}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <GeneratedMark mark={technology.mark} />
    </svg>
  );
}

function GeneratedMark({ mark }: { mark: CustomMark }) {
  switch (mark) {
    case 'typeorm':
      return <><path d="m24 4 17 10v19L24 43 7 33V14L24 4Z" /><path d="m7 14 17 10 17-10M24 24v19" /><circle cx="24" cy="24" r="4" /></>;
    case 'eloquent':
      return <><path d="M9 18c0-5 6-9 14-9s14 4 14 9-6 9-14 9-14-4-14-9Z" /><path d="M9 18v13c0 5 6 8 14 8 4 0 8-1 10-3M37 18v7" /><path d="M16 18h14m-7-5v10" /><circle cx="38" cy="35" r="4" /></>;
    case 'sqlalchemy':
      return <><path d="m24 5 15 8-15 8-15-8 15-8Z" /><path d="m9 21 15 8 15-8M9 29l15 8 15-8" /><path d="M24 13v8m0 8v8" /></>;
    case 'aws':
      return <><path d="M12 31H9a5 5 0 0 1 0-10 13 13 0 0 1 25-3 7 7 0 0 1 2 13h-5" /><path d="M24 21v19m-7-7 7 7 7-7" /><path d="M13 42h22" /></>;
    case 'azure':
      return <><path d="m25 5 15 8-8 22H8L25 5Z" /><path d="m25 5-7 17h14m-8 13 8 3" /><circle cx="18" cy="22" r="2" /></>;
    case 'memcached':
      return <><path d="m8 15 12-7 12 7-12 7-12-7Z" /><path d="M8 15v14l12 7 12-7V15M20 22v14" /><path d="m23 16 9-5 8 5v10l-8 5-4-2" /></>;
    case 'rest':
      return <><circle cx="11" cy="12" r="4" /><circle cx="37" cy="12" r="4" /><circle cx="24" cy="36" r="4" /><path d="M15 12h16m-4-4 4 4-4 4M13 16l8 15m14-15-8 15" /></>;
    case 'grpc':
      return <><circle cx="24" cy="24" r="17" /><path d="M7 24h9m16 0h9M24 7v9m0 16v9" /><path d="m27 14-7 11h7l-6 10" /></>;
    case 'sessions':
      return <><rect x="8" y="7" width="32" height="34" rx="8" /><circle cx="24" cy="19" r="5" /><path d="M15 34c1-5 5-8 9-8s8 3 9 8" /></>;
    case 'jwt':
      return <><path d="M28 7a13 13 0 1 0 10 10l5-5-7-7-5 5" /><circle cx="18" cy="20" r="3" /><path d="m27 28 8 8m-4-12 8 8m-13-2-5 5" /></>;
    case 'playwright':
      return <><rect x="6" y="8" width="36" height="28" rx="5" /><path d="M6 16h36m-28-4h.1m5 0h.1" /><path d="m19 19 4 13 3-6 6-2-13-5Z" /></>;
    case 'phpunit':
      return <><path d="M24 5 40 11v12c0 10-6 16-16 20C14 39 8 33 8 23V11L24 5Z" /><path d="m16 24 5 5 11-12" /></>;
  }
}
