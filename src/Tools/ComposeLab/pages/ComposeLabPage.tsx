import { useMemo, useState, type KeyboardEvent } from 'react';
import { SiteHeader } from '../../../components/SiteHeader';
import { serviceCatalogue } from '../catalogue';
import { generateComposeYaml } from '../compose';
import { ServiceCard } from '../components/ServiceCard';
import type { ComposeService, ServicePreset, WorkspaceTab } from '../types';

const tabNames: Record<WorkspaceTab, string> = { configure: 'Configure', compose: 'compose.yaml' };
const buttonClass = 'min-h-10 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-300 transition hover:border-violet-300/50 hover:bg-violet-400/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300';

function createService(preset?: ServicePreset, id = `service-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`): ComposeService {
  const name = (preset?.name ?? 'custom-service').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '');
  return {
    id, name: name || 'custom-service', source: 'image', image: preset?.image ?? '', buildContext: '.', dockerfile: 'Dockerfile', buildArgs: [], buildTarget: '',
    ports: preset?.ports ?? [], environment: preset?.environment ?? [], volumes: preset?.volumes ?? [], restart: 'no', dependencies: [], command: '', entrypoint: '',
    healthcheckTest: '', healthcheckDisabled: false, healthcheckInterval: '', healthcheckStartInterval: '', healthcheckTimeout: '', healthcheckRetries: '', healthcheckStartPeriod: '', networks: '',
  };
}

function downloadYaml(content: string) {
  const blobUrl = URL.createObjectURL(new Blob([content], { type: 'text/yaml;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = 'compose.yaml';
  anchor.click();
  URL.revokeObjectURL(blobUrl);
}

export function ComposeLabPage() {
  const [services, setServices] = useState<ComposeService[]>([]);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('configure');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [feedback, setFeedback] = useState('');
  const [copyStatus, setCopyStatus] = useState<'copied' | 'error' | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<'downloaded' | 'error' | null>(null);
  const composeYaml = useMemo(() => generateComposeYaml(services), [services]);

  function chooseTab(tab: WorkspaceTab) {
    setFeedback('');
    setCopyStatus(null);
    setDownloadStatus(null);
    setActiveTab(tab);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, current: WorkspaceTab) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs: WorkspaceTab[] = ['configure', 'compose'];
    const currentIndex = tabs.indexOf(current);
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (currentIndex + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    chooseTab(nextTab);
    document.getElementById(`composelab-tab-${nextTab}`)?.focus();
  }

  function addService(preset?: ServicePreset) {
    const service = createService(preset);
    setServices((current) => {
      let name = service.name;
      let suffix = 2;
      while (current.some((item) => item.name === name)) {
        name = `${service.name}-${suffix}`;
        suffix += 1;
      }
      return [...current, { ...service, name }];
    });
    setExpandedService(service.id);
    setSelectedPreset('');
    setFeedback('');
  }

  async function copyYaml() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(composeYaml);
      setCopyStatus('copied');
      setFeedback('');
    } catch {
      setCopyStatus('error');
      setFeedback('Could not copy Compose YAML. Check clipboard permissions and try again.');
    }
  }

  function handleDownload() {
    try {
      downloadYaml(composeYaml);
      setDownloadStatus('downloaded');
      setFeedback('');
    } catch {
      setDownloadStatus('error');
      setFeedback('Could not download compose.yaml. Try again.');
    }
  }

  const tabClass = (tab: WorkspaceTab) => `min-h-10 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${activeTab === tab ? 'bg-violet-500/20 text-violet-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;
  const outputActionClass = 'inline-flex min-h-10 w-32 items-center justify-center rounded-lg border px-4 text-sm font-semibold text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 motion-reduce:transition-none';

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-9 max-md:px-6 max-sm:px-4">
        <SiteHeader currentPage="composelab" />
        <section className="py-12 max-sm:py-9" aria-labelledby="composelab-title">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-sky-300"><span className="h-px w-5 bg-gradient-to-r from-sky-400 to-violet-400" /> DOCKER COMPOSE BUILDER</p>
          <h1 id="composelab-title" className="m-0 text-5xl font-bold leading-none tracking-tight text-white max-sm:text-4xl">ComposeLab<span className="text-violet-400">.</span></h1>
          <p className="mb-0 mt-4 max-w-2xl text-base leading-7 text-slate-400">Configure services and inspect the generated Compose file.</p>
        </section>

        <section className="mb-16 overflow-hidden rounded-2xl border border-violet-200/15 bg-gradient-to-br from-slate-900 to-slate-900/70 shadow-2xl shadow-black/20" aria-label="ComposeLab workspace">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 px-5 py-4">
            <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/80 p-1" role="tablist" aria-label="ComposeLab workspace views">
              {(['configure', 'compose'] as const).map((tab) => <button key={tab} id={`composelab-tab-${tab}`} type="button" role="tab" aria-selected={activeTab === tab} aria-controls={`composelab-panel-${tab}`} tabIndex={activeTab === tab ? 0 : -1} className={tabClass(tab)} onClick={() => chooseTab(tab)} onKeyDown={(event) => handleTabKeyDown(event, tab)}>{tabNames[tab]}</button>)}
            </div>
            {activeTab === 'configure' ? <div className="flex flex-wrap gap-2">
              <label className="sr-only" htmlFor="service-catalogue">Common service</label>
              <select id="service-catalogue" className="min-h-10 max-w-52 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 focus:border-violet-400 focus:outline-none" value={selectedPreset} onChange={(event) => setSelectedPreset(event.target.value)}>
                <option value="">Choose Services...</option>{serviceCatalogue.map((preset) => <option key={preset.name} value={preset.name}>{preset.name}</option>)}
              </select>
              <button className="min-h-10 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled={!selectedPreset} onClick={() => addService(serviceCatalogue.find((preset) => preset.name === selectedPreset))}>Add service</button>
              <button className={buttonClass} type="button" onClick={() => addService()}>Custom service</button>
            </div> : <div className="flex flex-wrap gap-2">
              <button className={`${outputActionClass} ${copyStatus === 'copied' ? 'border-emerald-400/40 bg-emerald-700 hover:bg-emerald-600' : copyStatus === 'error' ? 'border-rose-400/40 bg-rose-900 hover:bg-rose-800' : 'border-slate-700 bg-slate-900 hover:border-violet-300/50 hover:bg-violet-400/10'}`} type="button" onClick={() => void copyYaml()}>{copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Copy failed' : 'Copy'}</button>
              <button className={`${outputActionClass} ${downloadStatus === 'downloaded' ? 'border-emerald-400/40 bg-emerald-700 hover:bg-emerald-600' : downloadStatus === 'error' ? 'border-rose-400/40 bg-rose-900 hover:bg-rose-800' : 'border-slate-700 bg-slate-900 hover:border-violet-300/50 hover:bg-violet-400/10'}`} type="button" onClick={handleDownload}>{downloadStatus === 'downloaded' ? 'Downloaded' : downloadStatus === 'error' ? 'Download failed' : 'Download'}</button>
              {copyStatus === 'copied' && <span className="sr-only" role="status">Compose YAML copied to clipboard.</span>}
              {downloadStatus === 'downloaded' && <span className="sr-only" role="status">compose.yaml download started.</span>}
            </div>}
          </div>

          <div id="composelab-panel-configure" className="space-y-5 p-5 max-sm:p-3" role="tabpanel" aria-labelledby="composelab-tab-configure" hidden={activeTab !== 'configure'}>
            {services.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-6 py-14 text-center">
              <p className="mb-2 text-lg font-semibold text-slate-200">Start with a service</p><p className="m-0 text-sm leading-6 text-slate-500">Choose a common image or create a custom service. The generated Compose file is available in the next tab.</p>
            </div> : <div className="space-y-3">{services.map((service) => <ServiceCard key={service.id} service={service} others={services} expanded={expandedService === service.id} onToggle={() => setExpandedService(expandedService === service.id ? null : service.id)} onRemove={() => { setServices((current) => current.filter((item) => item.id !== service.id).map((item) => ({ ...item, dependencies: item.dependencies.filter((dependency) => dependency.service !== service.name) }))); setExpandedService(null); }} onChange={(changes) => {
              if (changes.name !== undefined && services.some((item) => item.id !== service.id && item.name === changes.name)) {
                setFeedback(`A service named “${changes.name}” already exists.`);
                return;
              }
              const renamedTo = changes.name;
              setServices((current) => current.map((item) => item.id === service.id
                ? { ...item, ...changes }
                : renamedTo !== undefined
                  ? { ...item, dependencies: item.dependencies.map((dependency) => dependency.service === service.name ? { ...dependency, service: renamedTo } : dependency) }
                  : item));
            }} />)}</div>}
          </div>

          <div id="composelab-panel-compose" className="space-y-3 p-5 max-sm:p-3" role="tabpanel" aria-labelledby="composelab-tab-compose" hidden={activeTab !== 'compose'}>
            <p className="m-0 text-sm leading-6 text-slate-400">Generated from Configure. This view is read-only; update services in Configure to change the file.</p>
            <textarea aria-label="compose.yaml output" className="min-h-128 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-200 max-sm:min-h-96 max-sm:p-4" spellCheck={false} readOnly value={composeYaml} />
          </div>
          {feedback && <p className={`m-0 px-5 pb-4 text-sm ${feedback.startsWith('Could not') ? 'text-rose-300' : 'text-emerald-300'}`} role={feedback.startsWith('Could not') ? 'alert' : 'status'}>{feedback}</p>}
        </section>
        <footer className="flex min-h-16 items-center justify-between border-t border-violet-200/10 text-xs text-slate-500"><span>Configuration files, ready for your project</span><a className="text-sky-300 no-underline hover:text-sky-100" href="/">← Back to all tools</a></footer>
      </div>
    </main>
  );
}
