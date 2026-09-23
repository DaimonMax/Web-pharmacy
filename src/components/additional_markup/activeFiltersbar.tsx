'use client';

import React from 'react';
import { useCatalog } from '@/context/catalogContext';

interface FilterTag {
  key: string;
  label: string;
}

export const ActiveFiltersBar: React.FC = () => {
  const catalog = useCatalog();
  const { filters, searchQuery, categories, varieties } = catalog;

  const category = categories.find((c) => c.id === filters.categoryId);
  const variety = varieties.find((v) => v.id === filters.varietyId);

  const tags: FilterTag[] = [];
  if (searchQuery) tags.push({ key: 'search', label: `"${searchQuery}"` });
  if (category) tags.push({ key: 'cat', label: category.name });
  if (variety) tags.push({ key: 'variety', label: variety.name });
  if (filters.isRecipeRequired === true) tags.push({ key: 'rx', label: 'З рецептом' });
  if (filters.isRecipeRequired === false) tags.push({ key: 'rx', label: 'Без рецепту' });
  if (filters.isForChildren) tags.push({ key: 'kids', label: 'Дитячі' });
  if (filters.priceMin > 0 || filters.priceMax < 600) {
    tags.push({ key: 'price', label: `${filters.priceMin}–${filters.priceMax} грн` });
  }

  if (tags.length === 0) return null;

  const clearFilter = (key: string) => {
    switch (key) {
      case 'search':
        catalog.clearSearch();
        break;
      case 'cat':
        catalog.setCategoryId(null);
        break;
      case 'variety':
        catalog.setVarietyId(null);
        break;
      case 'rx':
        catalog.setRxFilter(null);
        break;
      case 'kids':
        catalog.setIsForChildren(false);
        break;
      case 'price':
        catalog.setPriceRange(0, 600);
        break;
    }
  };

  return (
    <div className="active-filters-bar" id="activeFiltersBar">
      <span className="afb-label">Фільтри:</span>
      <div className="afb-tags" id="afbTags">
        {tags.map((tag, idx) => (
          <span className="afb-tag" key={`${tag.key}-${idx}`}>
            {tag.label}
            <button type="button" onClick={() => clearFilter(tag.key)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <button className="afb-clear" id="afbClear" type="button" onClick={() => catalog.resetAllFilters()}>
        Скинути всі
      </button>
    </div>
  );
};