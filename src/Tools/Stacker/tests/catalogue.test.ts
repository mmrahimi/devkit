import { describe, expect, it } from 'vitest';
import { categories, type Category } from '../catalogue';

describe('technology catalogue', () => {
  it('keeps the ten requested categories and unique technology identifiers', () => {
    const categoryIds = categories.map(({ id }) => id);
    const technologyIds = categories.flatMap(({ technologies }) => technologies.map(({ id }) => id));

    expect(categoryIds).toHaveLength(10);
    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    expect(new Set(technologyIds).size).toBe(technologyIds.length);
  });

  it('gives each technology either a bundled brand logo or its own generated mark', () => {
    const allCategories: readonly Category[] = categories;
    const technologies = allCategories.flatMap(({ technologies: options }) => options);
    const branded = technologies.filter(({ icon }) => icon !== undefined);

    expect(branded.length).toBeGreaterThan(0);
    expect(branded.every(({ icon }) => icon?.path.length && icon.hex.length === 6)).toBe(true);
    expect(technologies.every(({ icon, mark }) => icon !== undefined || mark !== undefined)).toBe(true);
    expect(technologies.filter(({ mark }) => mark).every(({ mark }) => mark !== undefined)).toBe(true);
  });
});
