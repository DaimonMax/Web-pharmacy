'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  fetchProducts,
  fetchCategories,
  fetchVarieties,
  fetchDailyDeal,
  ProductFilters,
  DailyDealResponse,
} from '@/lib/apiServices/productsApi';
import { Product } from '@/shared/types/product'; 
import { Category } from '@/shared/types/category'; 
import { Variety } from '@/shared/types/variety'; 

const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 600;
const SHOWN_STEP = 10;
const FILTER_DEBOUNCE_MS = 300;

export interface CatalogFiltersState {
  categoryId: number | null;
  varietyId: number | null;
  isRecipeRequired: boolean | null;
  isForChildren: boolean;
  priceMin: number;
  priceMax: number;
}

const DEFAULT_FILTERS: CatalogFiltersState = {
  categoryId: null,
  varietyId: null,
  isRecipeRequired: null,
  isForChildren: false,
  priceMin: DEFAULT_PRICE_MIN,
  priceMax: DEFAULT_PRICE_MAX,
};

interface CatalogContextValue {
  products: Product[];
  visibleProducts: Product[];
  categories: Category[];
  varieties: Variety[];
  dailyDeal: DailyDealResponse | null;

  isLoading: boolean;
  shown: number;
  hasMore: boolean;
  filters: CatalogFiltersState;
  searchQuery: string;

  setCategoryId: (id: number | null) => void; 
  setVarietyId: (id: number | null) => void;
  setRxFilter: (value: 'with' | 'without' | null) => void;
  setIsForChildren: (value: boolean) => void;
  setPriceRange: (min: number, max: number) => void;
  applySearch: (query: string) => void;
  clearSearch: () => void;
  resetAllFilters: () => void;
  showMore: () => void;
  refreshDailyDeal: () => Promise<void>;
  getLoadedProductById: (id: number) => Product | undefined; 
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [dailyDeal, setDailyDeal] = useState<DailyDealResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shown, setShown] = useState(SHOWN_STEP);
  const [filters, setFilters] = useState<CatalogFiltersState>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQueryState] = useState('');

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload: ProductFilters = {
        searchTerm: searchQuery || undefined,
        categoryId: filters.categoryId,
        varietyId: filters.varietyId,
        isRecipeRequired: filters.isRecipeRequired,
        isForChildren: filters.isForChildren,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
      };
      const data = await fetchProducts(payload);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    setShown(SHOWN_STEP);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      runFetch();
    }, FILTER_DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, filters]);

  const refreshDailyDeal = useCallback(async () => {
    try {
      const deal = await fetchDailyDeal();
      setDailyDeal(deal);
    } catch {
      setDailyDeal(null);
    }
  }, []);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchVarieties().then(setVarieties).catch(() => setVarieties([]));
    refreshDailyDeal();
  }, [refreshDailyDeal]);

  const setCategoryId = useCallback((id: number | null) => {
    setFilters((prev) => ({ ...prev, categoryId: id }));
  }, []);

  const setVarietyId = useCallback((id: number | null) => {
    setFilters((prev) => ({ ...prev, varietyId: id }));
  }, []);

  const setRxFilter = useCallback((value: 'with' | 'without' | null) => {
    const boolVal = value === 'with' ? true : value === 'without' ? false : null;
    setFilters((prev) => ({ ...prev, isRecipeRequired: boolVal }));
  }, []);

  const setIsForChildren = useCallback((value: boolean) => {
    setFilters((prev) => ({ ...prev, isForChildren: value }));
  }, []);

  const setPriceRange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
  }, []);

  const applySearch = useCallback((query: string) => {
    setSearchQueryState(query.trim().toLowerCase());
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQueryState('');
  }, []);

  const resetAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchQueryState('');
  }, []);

  const showMore = useCallback(() => {
    setShown((prev) => prev + SHOWN_STEP);
  }, []);

  const getLoadedProductById = useCallback(
    (id: number) => products.find((p) => p.id === id),
    [products]
  );

  const visibleProducts = products.slice(0, shown);
  const hasMore = products.length > shown;

  return (
    <CatalogContext.Provider
      value={{
        products,
        visibleProducts,
        categories,
        varieties,
        dailyDeal,
        isLoading,
        shown,
        hasMore,
        filters,
        searchQuery,
        setCategoryId,
        setVarietyId,
        setRxFilter,
        setIsForChildren,
        setPriceRange,
        applySearch,
        clearSearch,
        resetAllFilters,
        showMore,
        refreshDailyDeal,
        getLoadedProductById,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}