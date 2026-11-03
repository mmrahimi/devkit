import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarkpadPage } from '../pages/MarkpadPage';

const originalClipboard = navigator.clipboard;

function provideClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

afterEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: originalClipboard,
  });
});

describe('Markpad', () => {
  it('starts with an empty document and switches between edit and preview', () => {
    render(<MarkpadPage />);

    expect(screen.getByRole('textbox', { name: 'Markdown source' })).toHaveValue('');
    expect(screen.getByRole('tab', { name: 'Edit' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
    expect(screen.getByText('Your rendered document will appear here as you write.')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('tab', { name: 'Edit' }));
    expect(screen.getByRole('textbox', { name: 'Markdown source' })).toHaveValue('');
  });

  it('renders standard Markdown and GitHub Flavored Markdown', () => {
    render(<MarkpadPage />);
    const fence = String.fromCharCode(96).repeat(3);
    const markdown = [
      '# Release notes',
      '',
      'A **bold** word and an _italic_ word, plus ~~retired~~ text.',
      '',
      '[Read the docs](https://example.com/docs) and www.example.com',
      '',
      '- First unordered item',
      '- Second unordered item',
      '',
      '1. First ordered item',
      '2. Second ordered item',
      '',
      '> A useful quote.',
      '',
      '- [x] Complete',
      '- [ ] Incomplete',
      '',
      '| Stage | Status |',
      '| --- | --- |',
      '| Draft | Ready |',
      '',
      fence + 'ts',
      'const ready = true;',
      fence,
      '',
      '![Mark](https://example.com/mark.png)',
    ].join('\n');
    fireEvent.change(screen.getByRole('textbox', { name: 'Markdown source' }), { target: { value: markdown } });
    fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));

    const preview = screen.getByRole('tabpanel');
    expect(within(preview).getByRole('heading', { name: 'Release notes' })).toBeInTheDocument();
    expect(within(preview).getByText('bold')).toBeInTheDocument();
    expect(within(preview).getByText('italic')).toBeInTheDocument();
    expect(within(preview).getByText('retired')).toHaveProperty('tagName', 'DEL');
    expect(within(preview).getByRole('link', { name: 'Read the docs' })).toHaveAttribute('href', 'https://example.com/docs');
    expect(within(preview).getByRole('link', { name: 'www.example.com' })).toHaveAttribute('href', 'http://www.example.com');
    expect(within(preview).getByText('Second unordered item')).toBeInTheDocument();
    expect(within(preview).getByText('Second ordered item')).toBeInTheDocument();
    expect(within(preview).getByText('A useful quote.')).toBeInTheDocument();
    expect(within(preview).getAllByRole('checkbox')).toHaveLength(2);
    expect(within(preview).getAllByRole('checkbox')[0]).toBeChecked();
    expect(within(preview).getByRole('table')).toBeInTheDocument();
    expect(within(preview).getByText('const ready = true;')).toBeInTheDocument();
    expect(within(preview).getByRole('img', { name: 'Mark' })).toHaveAttribute('src', 'https://example.com/mark.png');
  });

  it('keeps exact source text across view changes and safely handles unusual Markdown', () => {
    render(<MarkpadPage />);
    const markdown = '# Draft\n\n*unfinished emphasis\n\n<script>alert("not executable")</script>\n';
    fireEvent.change(screen.getByRole('textbox', { name: 'Markdown source' }), { target: { value: markdown } });
    fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));

    expect(screen.getByRole('heading', { name: 'Draft' })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel').querySelector('script')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Edit' }));
    expect(screen.getByRole('textbox', { name: 'Markdown source' })).toHaveValue(markdown);
  });

  it('loads the optional example and copies the exact Markdown source', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    provideClipboard(writeText);
    render(<MarkpadPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Load example' }));
    const editor = screen.getByRole('textbox', { name: 'Markdown source' });
    const example = (editor as HTMLTextAreaElement).value;
    expect(example).toContain('# Markpad');
    expect(example).toContain('| Action | Shortcut |');

    fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
    expect(screen.getByRole('heading', { name: 'Markpad' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy Markdown' }));

    expect(await screen.findByText('Markdown copied to clipboard.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledExactlyOnceWith(example);
  });

  it('shows a clear message when clipboard access fails', async () => {
    provideClipboard(vi.fn().mockRejectedValue(new Error('Clipboard denied')));
    render(<MarkpadPage />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Markdown source' }), { target: { value: '# Exact source' } });
    fireEvent.click(screen.getByRole('button', { name: 'Copy Markdown' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not copy Markdown. Check clipboard permissions and try again.');
  });
});
