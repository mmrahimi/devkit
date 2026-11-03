import { useState, type KeyboardEvent } from 'react';
import { SiteHeader } from '../../../components/SiteHeader';
import { MarkdownPreview } from '../components/MarkdownPreview';

const exampleMarkdown = `# Markpad

A small space for **clear writing** and _quick notes_.

## A simple checklist

- [x] Write in Markdown
- [ ] Preview the result
- [ ] Copy the original text

> Keep the document focused. The formatting stays in the Markdown.

| Action | Shortcut |
| --- | --- |
| Make text bold | \`**text**\` |
| Add a link | \`[title](https://example.com)\` |

~~No formatting toolbar needed.~~

\`\`\`ts
const idea = 'ready to write';
\`\`\`
`;

type View = 'edit' | 'preview';

export function MarkpadPage() {
  const [markdown, setMarkdown] = useState('');
  const [activeView, setActiveView] = useState<View>('edit');
  const [copyStatus, setCopyStatus] = useState<'copied' | 'error' | null>(null);

  function handleViewKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentView: View) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const nextView = event.key === 'Home'
      ? 'edit'
      : event.key === 'End'
        ? 'preview'
        : currentView === 'edit' ? 'preview' : 'edit';
    setActiveView(nextView);
    document.getElementById(`markpad-tab-${nextView}`)?.focus();
  }

  async function copyMarkdown() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable.');
      await navigator.clipboard.writeText(markdown);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  }

  function updateMarkdown(value: string) {
    setMarkdown(value);
    setCopyStatus(null);
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-9 max-md:px-6 max-sm:px-4">
        <SiteHeader currentPage="markpad" />

        <section className="py-14 max-sm:py-10" aria-labelledby="markpad-title">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold tracking-widest text-sky-300"><span className="h-px w-5 bg-gradient-to-r from-sky-400 to-violet-400" /> MARKDOWN EDITOR</p>
          <h1 id="markpad-title" className="m-0 text-5xl font-bold leading-none tracking-tight text-white max-sm:text-4xl">Markpad<span className="text-sky-400">.</span></h1>
          <p className="mb-0 mt-4 max-w-xl text-base leading-7 text-slate-400 max-sm:text-sm">Write Markdown on your terms. Switch views to check the rendered document.</p>
        </section>

        <section className="mb-16 overflow-hidden rounded-2xl border border-sky-200/15 bg-gradient-to-br from-slate-900 to-slate-900/70 shadow-2xl shadow-black/20 max-sm:mb-12" aria-label="Markdown workspace">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 px-5 py-4 max-sm:items-stretch">
            <div className="inline-flex gap-2 rounded-xl border border-slate-700 bg-slate-950/80 p-1" role="tablist" aria-label="Editor and preview views">
              {(['edit', 'preview'] as const).map((view) => (
                <button
                  key={view}
                  id={`markpad-tab-${view}`}
                  type="button"
                  role="tab"
                  aria-selected={activeView === view}
                  aria-controls="markpad-panel"
                  tabIndex={activeView === view ? 0 : -1}
                  onClick={() => setActiveView(view)}
                  onKeyDown={(event) => handleViewKeyDown(event, view)}
                  className={`min-h-10 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${activeView === view ? 'bg-violet-500/20 text-violet-100 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  {view === 'edit' ? 'Edit' : 'Preview'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-stretch">
              <button className="min-h-10 rounded-lg border border-slate-600 px-4 text-sm font-semibold text-slate-300 transition hover:border-violet-300/50 hover:bg-violet-400/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300" type="button" onClick={() => { updateMarkdown(exampleMarkdown); }}>
                Load example
              </button>
              <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-stretch" aria-live="polite">
                <button className={`inline-flex min-h-10 w-36 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 motion-reduce:transition-none ${copyStatus === 'copied' ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-gradient-to-r from-violet-600 to-blue-600 shadow-violet-950/30 hover:from-violet-500 hover:to-blue-500'}`} type="button" onClick={copyMarkdown}>
                  {copyStatus === 'copied' ? 'Copied!' : 'Copy Markdown'}
                </button>
                {copyStatus === 'copied' && <span className="sr-only" role="status">Markdown copied to clipboard.</span>}
                {copyStatus === 'error' && <p className="m-0 text-sm text-rose-300" role="alert">Could not copy Markdown. Check clipboard permissions and try again.</p>}
              </div>
            </div>
          </div>

          <div id="markpad-panel" className="p-5 max-sm:p-3" role="tabpanel" aria-labelledby={`markpad-tab-${activeView}`}>
            {activeView === 'edit' ? (
              <textarea
                aria-label="Markdown source"
                autoCapitalize="off"
                autoCorrect="off"
                className="min-h-128 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-200 placeholder:text-slate-600 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 max-sm:min-h-96 max-sm:p-4"
                onChange={(event) => updateMarkdown(event.target.value)}
                placeholder="Start writing Markdown…"
                spellCheck={false}
                value={markdown}
              />
            ) : (
              <MarkdownPreview markdown={markdown} />
            )}
          </div>

        </section>

        <footer className="flex min-h-16 items-center justify-between border-t border-violet-200/10 text-xs text-slate-500"><span>Made for writing things down</span><a className="text-sky-300 no-underline hover:text-sky-100" href="/">← Back to all tools</a></footer>
      </div>
    </main>
  );
}
