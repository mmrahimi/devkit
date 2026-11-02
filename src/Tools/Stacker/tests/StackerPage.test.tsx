import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StackerPage } from '../pages/StackerPage';
import { exportDiagramAsPng } from '../png-export';

vi.mock('../png-export', () => ({ exportDiagramAsPng: vi.fn() }));

describe('Stacker page', () => {
  it('shows all ten categories and all their choices together', () => {
    render(<StackerPage />);

    expect(screen.getByRole('heading', { name: 'Stacker.' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Technology categories' })).toBeInTheDocument();
    expect(document.querySelector('.diagram-board')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'pytest' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Testing' })).toBeInTheDocument();
  });

  it('allows one choice per category and toggles a selected choice off', () => {
    render(<StackerPage />);
    const react = screen.getByRole('button', { name: 'React' });
    const vue = screen.getByRole('button', { name: 'Vue.js' });

    fireEvent.click(react);
    expect(react).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(vue);
    expect(react).toHaveAttribute('aria-pressed', 'false');
    expect(vue).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(vue);
    expect(vue).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Export PNG' })).toBeDisabled();
  });

  it('clears choices across every category and disables export again', () => {
    render(<StackerPage />);
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(screen.getByRole('button', { name: 'Django' }));

    expect(screen.getByRole('button', { name: 'Export PNG' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'Clear selections' }));

    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Django' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Export PNG' })).toBeDisabled();
  });

  it('reports browser PNG export failures clearly', async () => {
    vi.mocked(exportDiagramAsPng).mockRejectedValueOnce(new Error('canvas unavailable'));
    render(<StackerPage />);
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(screen.getByRole('button', { name: 'Export PNG' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('The PNG could not be created. Please try again.');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Export PNG' })).toBeEnabled());
  });
});
