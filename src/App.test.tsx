import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(() => {
  window.history.replaceState({}, '', '/');
});

describe('DevKit home', () => {
  it('links to each available tool from the collection homepage', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Useful little tools/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Stacker/ })).toHaveAttribute('href', '/tools/stacker');
    expect(screen.getByRole('link', { name: 'Open Markpad tool' })).toHaveAttribute('href', '/tools/markpad');
    expect(screen.getByRole('link', { name: 'Open ComposeLab tool' })).toHaveAttribute('href', '/tools/composelab');
    expect(screen.getByRole('link', { name: 'DevKit home' })).toHaveAttribute('href', '/');
  });

  it('opens Markpad when its tool route is visited', () => {
    window.history.replaceState({}, '', '/tools/markpad');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Markpad.' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Markdown source' })).toBeInTheDocument();
  });

  it('opens Stacker when its tool route is visited', () => {
    window.history.replaceState({}, '', '/tools/stacker');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Stacker.' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Technology categories' })).toBeInTheDocument();
  });

  it('opens ComposeLab for its tool route', () => {
    window.history.replaceState({}, '', '/tools/composelab');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'ComposeLab.' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Configure' })).toBeInTheDocument();
  });
});
