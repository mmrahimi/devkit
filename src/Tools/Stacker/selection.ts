import { categories, type CategoryId, type Selections, type Technology, type TechnologyId } from './catalogue';

export function chooseTechnology(
  selections: Selections,
  categoryId: CategoryId,
  technologyId: TechnologyId,
): Selections {
  const category = categories.find((item) => item.id === categoryId);
  if (!category?.technologies.some((technology) => technology.id === technologyId)) return selections;

  return { ...selections, [categoryId]: technologyId };
}

export function toggleTechnology(
  selections: Selections,
  categoryId: CategoryId,
  technologyId: TechnologyId,
): Selections {
  if (selections[categoryId] === technologyId) return clearCategory(selections, categoryId);
  return chooseTechnology(selections, categoryId, technologyId);
}

export function clearCategory(selections: Selections, categoryId: CategoryId): Selections {
  const nextSelections = { ...selections };
  delete nextSelections[categoryId];
  return nextSelections;
}

export function hasSelection(selections: Selections): boolean {
  return categories.some((category) => selections[category.id] !== undefined);
}

export function getSelectedTechnologies(selections: Selections): Array<{ categoryName: string; technology: Technology }> {
  return categories.flatMap((category) => {
    const selectedId = selections[category.id];
    const technology = category.technologies.find((option) => option.id === selectedId);
    return technology ? [{ categoryName: category.name, technology }] : [];
  });
}

