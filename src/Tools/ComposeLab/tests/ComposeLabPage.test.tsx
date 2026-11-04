import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseDocument } from 'yaml';
import { ComposeLabPage } from '../pages/ComposeLabPage';

const originalClipboard = navigator.clipboard;

function goToTab(name: string) {
  fireEvent.click(screen.getByRole('tab', { name }));
}

function generatedCompose() {
  goToTab('compose.yaml');
  return (screen.getByRole('textbox', { name: 'compose.yaml output' }) as HTMLTextAreaElement).value;
}

afterEach(() => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: originalClipboard });
  vi.unstubAllGlobals();
});

describe('ComposeLab', () => {
  it('adds catalog and custom services, updates them, and removes only the chosen service', () => {
    render(<ComposeLabPage />);

    fireEvent.change(screen.getByLabelText('Common service'), { target: { value: 'MySQL' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add service' }));
    expect(screen.getByText('mysql:8.4')).toBeInTheDocument();
    expect(screen.getByLabelText('Environment variables value 1')).toHaveAttribute('placeholder', 'value');
    expect(screen.queryByRole('textbox', { name: 'Environment variables raw text' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Custom service' }));
    fireEvent.change(screen.getByLabelText('Service name'), { target: { value: 'api' } });
    fireEvent.change(screen.getByLabelText('Image'), { target: { value: 'node:22-alpine' } });
    const yaml = generatedCompose();
    const document = parseDocument(yaml);
    expect(document.errors).toHaveLength(0);
    expect(yaml).not.toContain('${');
    expect(document.toJS()).toMatchObject({ services: { mysql: { image: 'mysql:8.4', ports: ['127.0.0.1:3306:3306'] }, api: { image: 'node:22-alpine' } } });

    goToTab('Configure');
    fireEvent.click(screen.getByRole('button', { name: 'Remove service api' }));
    expect(screen.queryByText('node:22-alpine')).not.toBeInTheDocument();
    expect(screen.getByText('mysql:8.4')).toBeInTheDocument();
  });

  it('generates build, environment, named volume, restart, health-aware dependency, and custom network settings', () => {
    render(<ComposeLabPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom service' }));
    fireEvent.change(screen.getByLabelText('Service name'), { target: { value: 'database' } });
    fireEvent.change(screen.getByLabelText('Image source'), { target: { value: 'build' } });
    fireEvent.change(screen.getByLabelText('Build context'), { target: { value: './database' } });
    fireEvent.change(screen.getByLabelText('Dockerfile path'), { target: { value: 'Dockerfile.db' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add port' }));
    fireEvent.change(screen.getByLabelText('Ports 1'), { target: { value: '5433:5432' } });
    fireEvent.change(screen.getByLabelText('Restart policy'), { target: { value: 'unless-stopped' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add volume' }));
    fireEvent.change(screen.getByLabelText('Volumes 1'), { target: { value: 'db-data:/var/lib/db' } });
    fireEvent.click(within(screen.getByRole('group', { name: 'Environment variables' })).getByRole('button', { name: 'Add variable' }));
    fireEvent.change(screen.getByLabelText('Environment variables key 1'), { target: { value: 'DATABASE_URL' } });
    fireEvent.change(screen.getByLabelText('Environment variables value 1'), { target: { value: 'postgres://db' } });
    fireEvent.click(screen.getByText('Advanced settings'));
    fireEvent.click(within(screen.getByRole('group', { name: 'Build arguments' })).getByRole('button', { name: 'Add variable' }));
    const buildArgumentName = screen.getByLabelText('Build arguments key 1');
    buildArgumentName.focus();
    fireEvent.change(buildArgumentName, { target: { value: 'M' } });
    expect(screen.getByLabelText('Build arguments key 1')).toHaveFocus();
    fireEvent.change(screen.getByLabelText('Build arguments key 1'), { target: { value: 'MODE' } });
    fireEvent.change(screen.getByLabelText('Build arguments value 1'), { target: { value: 'production' } });
    fireEvent.change(screen.getByLabelText('Health check shell command'), { target: { value: 'pg_isready' } });
    fireEvent.change(screen.getByLabelText('Health check interval'), { target: { value: '20s' } });

    fireEvent.click(screen.getByRole('button', { name: 'Custom service' }));
    fireEvent.change(screen.getByLabelText('Service name'), { target: { value: 'api' } });
    fireEvent.click(screen.getByText('Advanced settings'));
    fireEvent.click(screen.getByRole('button', { name: 'Add dependency' }));
    fireEvent.change(screen.getByLabelText('Dependency service 1'), { target: { value: 'database' } });
    fireEvent.change(screen.getByLabelText('Dependency condition 1'), { target: { value: 'service_healthy' } });

    const document = parseDocument(generatedCompose());
    expect(document.errors).toHaveLength(0);
    const compose = document.toJS() as { services: Record<string, Record<string, unknown>>; volumes: Record<string, unknown> };
    expect(compose.services.database.build).toMatchObject({ context: './database', dockerfile: 'Dockerfile.db', args: { MODE: 'production' } });
    expect(compose.services.database.ports).toEqual(['127.0.0.1:5433:5432']);
    expect(compose.services.database.environment).toEqual({ DATABASE_URL: 'postgres://db' });
    expect(compose.services.database.restart).toBe('unless-stopped');
    expect(compose.services.database.healthcheck).toEqual({ test: ['CMD-SHELL', 'pg_isready'], interval: '20s' });
    expect(compose.services.api.depends_on).toEqual({ database: { condition: 'service_healthy' } });
    expect(compose.volumes).toHaveProperty('db-data');
  });

  it('shows the generated YAML as read-only and reflects visual changes after switching tabs', () => {
    render(<ComposeLabPage />);
    expect(screen.queryByRole('tab', { name: '.env' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Custom service' }));
    fireEvent.change(screen.getByLabelText('Service name'), { target: { value: 'worker' } });
    goToTab('compose.yaml');
    const output = screen.getByRole('textbox', { name: 'compose.yaml output' }) as HTMLTextAreaElement;
    expect(output).toHaveAttribute('readonly');
    expect(output.value).toContain('worker:');
    goToTab('compose.yaml');
    expect(output.value).toContain('worker:');
    goToTab('Configure');
    fireEvent.change(screen.getByLabelText('Image'), { target: { value: 'busybox:latest' } });
    expect(output.value).toContain('busybox:latest');
  });

  it('keeps Advanced settings open when switching between Configure and the YAML tab', () => {
    render(<ComposeLabPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom service' }));
    fireEvent.click(screen.getByText('Advanced settings'));
    expect(screen.getByLabelText('Command')).toBeInTheDocument();

    goToTab('compose.yaml');
    goToTab('Configure');
    expect(screen.getByLabelText('Command')).toBeInTheDocument();
  });

  it('accepts comma-separated networks, binds ports to loopback, and hides health options when disabled', () => {
    render(<ComposeLabPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom service' }));
    fireEvent.change(screen.getByLabelText('Service name'), { target: { value: 'api' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add port' }));
    fireEvent.change(screen.getByLabelText('Ports 1'), { target: { value: '3306:3306' } });
    fireEvent.click(screen.getByText('Advanced settings'));
    fireEvent.change(screen.getByLabelText('Custom networks (comma-separated)'), { target: { value: 'backend, frontend' } });
    fireEvent.change(screen.getByLabelText('Health check shell command'), { target: { value: 'curl localhost' } });
    fireEvent.click(screen.getByLabelText('Disable the image health check'));
    expect(screen.queryByLabelText('Health check shell command')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Health check retries')).not.toBeInTheDocument();

    const document = parseDocument(generatedCompose());
    expect(document.errors).toHaveLength(0);
    expect(document.toJS()).toMatchObject({ services: { api: { ports: ['127.0.0.1:3306:3306'], networks: ['backend', 'frontend'], healthcheck: { disable: true } } }, networks: { backend: {}, frontend: {} } });
  });

  it('copies and downloads the generated Compose file', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const createObjectURL = vi.fn(() => 'blob:compose');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const downloadedFiles: string[] = [];
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { downloadedFiles.push(this.download); });
    render(<ComposeLabPage />);
    const yaml = generatedCompose();
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByRole('button', { name: 'Copied!' })).toHaveClass('w-32', 'bg-emerald-700');
    expect(await screen.findByRole('status')).toHaveTextContent('Compose YAML copied to clipboard.');
    expect(writeText).toHaveBeenCalledExactlyOnceWith(yaml);
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Downloaded' })).toHaveClass('w-32', 'bg-emerald-700');
    expect(downloadedFiles).toEqual(['compose.yaml']);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:compose');
    click.mockRestore();
  });

  it('shows an actionable message when clipboard access is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('Permission denied')) } });
    render(<ComposeLabPage />);
    goToTab('compose.yaml');
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not copy Compose YAML. Check clipboard permissions and try again.');
    expect(screen.getByRole('button', { name: 'Copy failed' })).toHaveClass('w-32', 'bg-rose-900');
  });

  it('shows a visible failure state when the browser cannot prepare the download', async () => {
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(() => { throw new Error('Downloads unavailable'); }) });
    render(<ComposeLabPage />);
    goToTab('compose.yaml');
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not download compose.yaml. Try again.');
    expect(screen.getByRole('button', { name: 'Download failed' })).toHaveClass('w-32', 'bg-rose-900');
  });
});
