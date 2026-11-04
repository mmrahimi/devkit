import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(() => {
  window.history.replaceState({}, '', '/');
});

describe('DevKit home', () => {
  it('introduces DevKit and links to the available Stacker tool', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Useful little tools/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Browse tools' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Stacker/ })).toHaveAttribute('href', '/tools/stacker');
    expect(screen.getByRole('link', { name: 'Open Markpad tool' })).toHaveAttribute('href', '/tools/markpad');
    expect(screen.getByRole('link', { name: 'Open ComposeLab tool' })).toHaveAttribute('href', '/tools/composelab');
    expect(screen.queryByText('More tools are taking shape.')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'DevKit home' })).toHaveAttribute('href', '/');
  });

  it('opens Markpad when its tool route is visited', () => {
    window.history.replaceState({}, '', '/tools/markpad');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Markpad.' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Markdown source' })).toBeInTheDocument();
  });

  it('opens ComposeLab for its tool route', () => {
    window.history.replaceState({}, '', '/tools/composelab');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'ComposeLab.' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Configure' })).toBeInTheDocument();
  });
});
