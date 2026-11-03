import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownPreviewProps = { markdown: string };

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="mb-5 mt-8 border-b border-slate-700 pb-3 text-3xl font-bold tracking-tight text-white first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight text-slate-100">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 mt-6 text-xl font-semibold text-slate-100">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-2 mt-5 text-lg font-semibold text-slate-100">{children}</h4>,
  p: ({ children }) => <p className="my-4 leading-7 text-slate-300">{children}</p>,
  a: ({ href, title, children }) => <a className="text-sky-300 underline decoration-sky-400/50 underline-offset-4 hover:text-sky-200" href={href} title={title}>{children}</a>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 text-slate-300 marker:text-violet-400">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 text-slate-300 marker:text-violet-300">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
  blockquote: ({ children }) => <blockquote className="my-5 border-l-2 border-violet-400 pl-5 text-slate-400">{children}</blockquote>,
  pre: ({ children }) => <pre className="my-5 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-200">{children}</pre>,
  code: ({ children }) => <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-violet-200">{children}</code>,
  table: ({ children }) => <div className="my-5 overflow-x-auto rounded-lg border border-slate-700"><table className="w-full border-collapse text-left text-sm">{children}</table></div>,
  thead: ({ children }) => <thead className="bg-slate-800 text-slate-100">{children}</thead>,
  th: ({ children }) => <th className="border-b border-slate-700 px-4 py-3 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-t border-slate-800 px-4 py-3 text-slate-300">{children}</td>,
  del: ({ children }) => <del className="text-slate-500">{children}</del>,
  hr: () => <hr className="my-8 border-slate-700" />,
  img: ({ src, alt, title }) => <img className="my-5 h-auto max-w-full rounded-lg border border-slate-700" src={src} alt={alt ?? ''} title={title} loading="lazy" />,
  input: ({ checked, disabled }) => <input className="mr-2 accent-violet-400" type="checkbox" checked={Boolean(checked)} disabled={disabled} readOnly />,
};

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  if (!markdown) {
    return (
      <div className="grid min-h-128 place-items-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center text-slate-500 max-sm:min-h-96">
        <p className="max-w-sm leading-7">Your rendered document will appear here as you write.</p>
      </div>
    );
  }

  return (
    <article className="min-h-128 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/60 p-8 text-slate-200 max-sm:min-h-96 max-sm:p-5">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
