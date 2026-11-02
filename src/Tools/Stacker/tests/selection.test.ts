import { describe, expect, it } from 'vitest';
import { categories } from '../catalogue';
import { chooseTechnology, clearCategory, getSelectedTechnologies, hasSelection, toggleTechnology } from '../selection';

describe('stack selection', () => {
  it('allows one technology per category by replacing the previous choice', () => {
    const firstChoice = chooseTechnology({}, 'frontend', 'react');
    const secondChoice = chooseTechnology(firstChoice, 'frontend', 'vue');

    expect(secondChoice.frontend).toBe('vue');
    expect(Object.keys(secondChoice)).toEqual(['frontend']);
  });

  it('toggles an existing selection off', () => {
    const withChoice = chooseTechnology({}, 'frontend', 'react');

    expect(toggleTechnology(withChoice, 'frontend', 'react')).toEqual({});
  });

  it('leaves a cleared category unselected', () => {
    const selections = clearCategory({ frontend: 'react', backend: 'django' }, 'backend');

    expect(selections).toEqual({ frontend: 'react' });
  });

  it('accepts any nonempty selection and rejects an empty one', () => {
    expect(hasSelection({})).toBe(false);
    expect(hasSelection({ api: 'rest' })).toBe(true);
  });

  it('returns selected technologies in catalogue order, including when categories are skipped', () => {
    const selected = getSelectedTechnologies({ testing: 'vitest', database: 'postgresql', frontend: 'react' });

    expect(selected.map(({ technology }) => technology.id)).toEqual(['react', 'postgresql', 'vitest']);
    expect(selected.map(({ categoryName }) => categoryName)).toEqual([
      categories[0].name,
      categories[2].name,
      categories[9].name,
    ]);
  });

  it('ignores a technology that does not belong to the selected category', () => {
    const selections = chooseTechnology({}, 'frontend', 'django');

    expect(selections).toEqual({});
  });
});
