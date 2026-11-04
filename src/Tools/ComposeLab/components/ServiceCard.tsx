import type { ComposeService, EnvironmentVariable } from '../types';

type ServiceCardProps = {
  service: ComposeService;
  others: ComposeService[];
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onChange: (changes: Partial<ComposeService>) => void;
};

const fieldClass = 'min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20';
const labelClass = 'mb-2.5 block text-sm font-medium text-slate-300';
const buttonClass = 'min-h-9 rounded-lg border border-slate-700 px-3 text-sm font-medium text-slate-300 transition hover:border-violet-300/40 hover:bg-violet-400/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300';

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <label className="block"><span className={labelClass}>{label}</span><input className={fieldClass} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function StringList({ label, values, onChange, placeholder, hint }: { label: string; values: string[]; onChange: (values: string[]) => void; placeholder: string; hint?: string }) {
  return (
    <fieldset className="min-w-0">
      <legend className={labelClass}>{label}</legend>
      {hint && <p className="mb-3 mt-0 text-xs leading-5 text-slate-500">{hint}</p>}
      <div className="space-y-2">
        {values.map((value, index) => (
          <div className="flex gap-2" key={`${label}-${index}`}>
            <input className={fieldClass} aria-label={`${label} ${index + 1}`} value={value} placeholder={placeholder} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} />
            <button className={buttonClass} aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
          </div>
        ))}
        <button className={buttonClass} type="button" onClick={() => onChange([...values, ''])}>Add {label.toLowerCase().replace(/s$/, '')}</button>
      </div>
    </fieldset>
  );
}

function KeyValueEditor({ label, values, onChange }: { label: string; values: EnvironmentVariable[]; onChange: (values: EnvironmentVariable[]) => void }) {
  function update(index: number, field: keyof EnvironmentVariable, value: string) {
    onChange(values.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  return (
    <fieldset className="min-w-0 space-y-4">
      <legend className={labelClass}>{label}</legend>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto]" key={index}>
            <input className={fieldClass} aria-label={`${label} key ${index + 1}`} value={item.key} placeholder="VARIABLE_NAME" onChange={(event) => update(index, 'key', event.target.value)} />
            <input className={fieldClass} aria-label={`${label} value ${index + 1}`} value={item.value} placeholder="value" onChange={(event) => update(index, 'value', event.target.value)} />
            <button className={buttonClass} aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
          </div>
        ))}
        <button className={buttonClass} type="button" onClick={() => onChange([...values, { key: '', value: '' }])}>Add variable</button>
      </div>
    </fieldset>
  );
}

export function ServiceCard({ service, others, expanded, onToggle, onRemove, onChange }: ServiceCardProps) {
  const dependencyOptions = others.filter((item) => item.name !== service.name);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <button className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300" type="button" aria-expanded={expanded} onClick={onToggle}>
          <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-violet-300/20 bg-violet-400/10 font-mono font-bold text-violet-200" aria-hidden="true">{service.name.slice(0, 2).toUpperCase()}</span>
          <span className="min-w-0"><span className="block truncate font-semibold text-white">{service.name}</span><span className="block truncate text-sm text-slate-500">{service.source === 'image' ? service.image || 'Image not set' : `Build · ${service.buildContext || '.'}`}</span></span>
          <span className="ml-auto text-slate-500" aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
        <button className={buttonClass} type="button" onClick={onRemove} aria-label={`Remove service ${service.name}`}>Remove</button>
      </div>

      {expanded && <div className="space-y-6 border-t border-slate-800 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Service name" value={service.name} placeholder="web" onChange={(name) => onChange({ name: name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })} />
          <label className="block"><span className={labelClass}>Image source</span><select className={fieldClass} value={service.source} onChange={(event) => onChange({ source: event.target.value as ComposeService['source'] })}><option value="image">Prebuilt image</option><option value="build">Build from local source</option></select></label>
          {service.source === 'image' ? <Field label="Image" value={service.image} placeholder="nginx:alpine" onChange={(image) => onChange({ image })} /> : <>
            <Field label="Build context" value={service.buildContext} placeholder="." onChange={(buildContext) => onChange({ buildContext })} />
            <Field label="Dockerfile path" value={service.dockerfile} placeholder="Dockerfile" onChange={(dockerfile) => onChange({ dockerfile })} />
          </>}
          <label className="block"><span className={labelClass}>Restart policy</span><select className={fieldClass} value={service.restart} onChange={(event) => onChange({ restart: event.target.value as ComposeService['restart'] })}><option value="no">no</option><option value="always">always</option><option value="unless-stopped">unless-stopped</option><option value="on-failure">on-failure</option></select></label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <StringList label="Ports" values={service.ports} onChange={(ports) => onChange({ ports })} placeholder="127.0.0.1:3306:3306" />
          <StringList label="Volumes" values={service.volumes} onChange={(volumes) => onChange({ volumes })} placeholder="./data:/var/lib/app or db-data:/data" />
        </div>
        <KeyValueEditor label="Environment variables" values={service.environment} onChange={(environment) => onChange({ environment })} />

        <details className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <summary className="cursor-pointer font-semibold text-slate-200 focus-visible:outline-2 focus-visible:outline-violet-300">Advanced settings</summary>
          <div className="mt-5 space-y-6">
            {service.source === 'build' && <div className="grid gap-4 sm:grid-cols-2"><Field label="Build target stage" value={service.buildTarget} placeholder="runtime" onChange={(buildTarget) => onChange({ buildTarget })} /><KeyValueEditor label="Build arguments" values={service.buildArgs} onChange={(buildArgs) => onChange({ buildArgs })} /></div>}
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Command" value={service.command} placeholder="npm start" onChange={(command) => onChange({ command })} /><Field label="Entrypoint" value={service.entrypoint} placeholder="/app/entrypoint.sh" onChange={(entrypoint) => onChange({ entrypoint })} /></div>
            <fieldset className="space-y-4"><legend className={labelClass}>Dependencies</legend>
              {service.dependencies.map((dependency, index) => <div key={`${dependency.service}-${index}`} className="grid gap-2 sm:grid-cols-2">
                <label><span className="sr-only">Dependency service {index + 1}</span><select className={fieldClass} aria-label={`Dependency service ${index + 1}`} value={dependency.service} onChange={(event) => onChange({ dependencies: service.dependencies.map((item, itemIndex) => itemIndex === index ? { ...item, service: event.target.value } : item) })}><option value="">Choose service</option>{dependencyOptions.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
                <div className="flex gap-2"><label className="min-w-0 flex-1"><span className="sr-only">Dependency condition {index + 1}</span><select className={fieldClass} aria-label={`Dependency condition ${index + 1}`} value={dependency.condition} onChange={(event) => onChange({ dependencies: service.dependencies.map((item, itemIndex) => itemIndex === index ? { ...item, condition: event.target.value as typeof dependency.condition } : item) })}><option value="service_started">Starts before this service</option><option value="service_healthy">Wait for healthy</option><option value="service_completed_successfully">Wait for successful completion</option></select></label><button className={buttonClass} type="button" aria-label={`Remove dependency ${index + 1}`} onClick={() => onChange({ dependencies: service.dependencies.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button></div>
              </div>)}
              <button className={buttonClass} type="button" onClick={() => onChange({ dependencies: [...service.dependencies, { service: '', condition: 'service_started' }] })}>Add dependency</button>
              <p className="m-0 text-xs leading-5 text-slate-500">A start order does not guarantee readiness. Choose “Wait for healthy” when the dependency has a health check.</p>
            </fieldset>
            <label className="flex items-center gap-2 text-sm text-slate-300"><input className="size-4 accent-violet-400" type="checkbox" checked={service.healthcheckDisabled} onChange={(event) => onChange({ healthcheckDisabled: event.target.checked })} />Disable the image health check</label>
            {!service.healthcheckDisabled && <div className="grid gap-4 sm:grid-cols-2"><Field label="Health check shell command" value={service.healthcheckTest} placeholder="pg_isready -U $POSTGRES_USER" onChange={(healthcheckTest) => onChange({ healthcheckTest })} /><Field label="Health check interval" value={service.healthcheckInterval} placeholder="30s" onChange={(healthcheckInterval) => onChange({ healthcheckInterval })} /><Field label="Health check start interval" value={service.healthcheckStartInterval} placeholder="5s" onChange={(healthcheckStartInterval) => onChange({ healthcheckStartInterval })} /><Field label="Health check timeout" value={service.healthcheckTimeout} placeholder="5s" onChange={(healthcheckTimeout) => onChange({ healthcheckTimeout })} /><Field label="Health check retries" value={service.healthcheckRetries} placeholder="3" onChange={(healthcheckRetries) => onChange({ healthcheckRetries })} /><Field label="Health check start period" value={service.healthcheckStartPeriod} placeholder="10s" onChange={(healthcheckStartPeriod) => onChange({ healthcheckStartPeriod })} /></div>}
            <Field label="Custom networks (comma-separated)" value={service.networks} placeholder="internal, edge" onChange={(networks) => onChange({ networks })} />
          </div>
        </details>
      </div>}
    </article>
  );
}
