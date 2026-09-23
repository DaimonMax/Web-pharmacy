'use client';

import React from 'react';
import { MED_TYPES } from '@/shared/utils/icons';
import { getCategoryIcon } from '@/shared/utils/icons';
import { Category } from '@/shared/types/category';

interface FilterPanelsProps {
  activeCategory: string;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  rxFilter: 'all' | 'with' | 'without';
  setRxFilter: (filter: 'all' | 'with' | 'without') => void;
  minPrice: number;
  maxPrice: number;
  handleMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
}

export const FilterPanels: React.FC<FilterPanelsProps> = ({
  activeCategory,
  selectedType,
  setSelectedType,
  rxFilter,
  setRxFilter,
  minPrice,
  maxPrice,
  handleMinChange,
  handleMaxChange,
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <>
      {activeCategory === 'cats' && (
        <div className="cats-panel" id="catsPanel">
          <div className="container">
            <div className="cats-panel-grid" id="catsPanelGrid">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  className={`cp-item ${selectedCategoryId === cat.id ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(cat.id);
                  }}
                >
                  <span
                    className="cp-icon"
                    dangerouslySetInnerHTML={{ __html: getCategoryIcon(cat.name) }}
                  />
                  <span>{cat.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'medTypes' && (
        <div className="cats-panel" id="medTypesPanel">
          <div className="container">
            <div className="med-types-row" id="medTypesRow">
              {MED_TYPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`med-type-btn ${selectedType === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedType(selectedType === item.id ? null : item.id)}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'rxFilter' && (
        <div className="cats-panel" id="rxPanel">
          <div className="container">
            <div className="rx-panel-inner">
              <span className="rx-panel-label">Фільтр за рецептом:</span>
              <div className="rx-toggles">
                <button
                  type="button"
                  className={`rx-toggle-btn ${rxFilter === 'with' ? 'active' : ''}`}
                  onClick={() => setRxFilter(rxFilter === 'with' ? 'all' : 'with')}
                >
                  З рецептом
                </button>
                <button
                  type="button"
                  className={`rx-toggle-btn ${rxFilter === 'without' ? 'active' : ''}`}
                  onClick={() => setRxFilter(rxFilter === 'without' ? 'all' : 'without')}
                >
                  Без рецепту
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'priceFilter' && (
        <div className="cats-panel" id="pricePanel">
          <div className="container">
            <div className="price-panel-inner">
              <div className="price-panel-label">Фільтр за ціною</div>
              <div className="pfc-layout">
                <span className="pfc-val-box">{minPrice} грн</span>
                <div className="pfc-track-wrap">
                  <div className="pfc-track-bg"></div>
                  <div
                    className="pfc-track-fill"
                    style={{
                      left: `${(minPrice / 600) * 100}%`,
                      right: `${100 - (maxPrice / 600) * 100}%`,
                    }}
                  />
                  <input id="priceMin" type="range" min="0" max="600" value={minPrice} step="5" onChange={handleMinChange} />
                  <input id="priceMax" type="range" min="0" max="600" value={maxPrice} step="5" onChange={handleMaxChange} />
                </div>
                <span className="pfc-val-box">{maxPrice} грн</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};