'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { NAV_ITEMS, VARIETY_ICON_MAP } from '@/shared/utils/icons';
import { FilterPanels } from '@/components/additional_markup/filterPanels';
import { ThemeToggle } from '@/components/additional_markup/themeToggle';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import { useWishlist } from '@/context/wishlistContext';
import { usePrescriptions } from '@/context/prescriptionContext';
import { useCatalog } from '@/context/catalogContext';
import { Product } from '@/shared/types/product';

const SLUG_TO_VARIETY_ID: Record<string, number> = Object.fromEntries(
  Object.entries(VARIETY_ICON_MAP).map(([id, slug]) => [slug, Number(id)])
);

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAccount: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenRecipeUpload: () => void;
  onRequireAuth: () => void;
  onNavigateToView: (view: 'meds' | 'advice' | 'wishlist' | 'kids') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenAccount,
  onOpenOrders,
  onOpenAdmin,
  onOpenRecipeUpload,
  onRequireAuth,
  onNavigateToView,
}) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { prescriptions } = usePrescriptions();
  const catalog = useCatalog();

  const hasRecipe = prescriptions.length > 0;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedType = catalog.filters.varietyId != null ? VARIETY_ICON_MAP[catalog.filters.varietyId] ?? null : null;
  const rxFilter: 'all' | 'with' | 'without' =
  catalog.filters.isRecipeRequired === true ? 'with' : catalog.filters.isRecipeRequired === false ? 'without' : 'all';

  const minPrice = catalog.filters.priceMin;
  const maxPrice = catalog.filters.priceMax;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    catalog.applySearch(e.target.value);
    onNavigateToView('meds'); 
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.header-nav') && !target.closest('.cats-panel')) {
        setActiveCategory('all');
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSelectType = (slugOrNull: string | null) => {
    const varietyId = slugOrNull ? SLUG_TO_VARIETY_ID[slugOrNull] ?? null : null;
    catalog.setVarietyId(varietyId);
    onNavigateToView('meds');
  };

  const handleRxFilter = (value: 'all' | 'with' | 'without') => {
    catalog.setRxFilter(value === 'all' ? null : value);
    onNavigateToView('meds');
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxPrice - 5);
    catalog.setPriceRange(newMin, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minPrice + 5);
    catalog.setPriceRange(minPrice, newMax);
  };

  const handleNavClick = (id: string) => {
    switch (id) {
      case 'all':
        catalog.resetAllFilters();
        setActiveCategory('all');
        onNavigateToView('meds');
        break;
      case 'kids': {
        const next = !catalog.filters.isForChildren;
        catalog.setIsForChildren(next);
        setActiveCategory(next ? 'kids' : 'all');
        onNavigateToView('meds');
        break;
      }
      case 'flashNav':
        setActiveCategory('all');
        onNavigateToView('meds');
        setTimeout(() => {
          document.getElementById('flashSection')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        break;
      case 'advice':
        setActiveCategory('all');
        onNavigateToView('advice');
        break;
      default:
        setActiveCategory((prev) => (prev === id ? 'all' : id));
    }
  };

  const isNavItemFiltered = (id: string): boolean => {
    switch (id) {
      case 'cats':
        return catalog.filters.categoryId !== null;
      case 'medTypes':
        return catalog.filters.varietyId !== null;
      case 'rxFilter':
        return catalog.filters.isRecipeRequired !== null;
      case 'priceFilter':
        return catalog.filters.priceMin > 0 || catalog.filters.priceMax < 600;
      case 'kids':
        return catalog.filters.isForChildren;
      default:
        return false;
    }
  };

  return (
    <header className="header" id="header">
      <div className="header-main">
        <div className="container header-main-inner">
          <Link href="/" className="logo" onClick={() => handleNavClick('all')}>
            <span className="logo-text">Æsculapius</span>
          </Link>

          <div className="header-search">
            <input
              type="text"
              placeholder="Знайти препарат або товар"
              autoComplete="off"
              value={catalog.searchQuery}
              onChange={handleSearchChange}
            />
            <button className="search-btn" type="button" onClick={() => onNavigateToView('meds')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          <div className="header-actions">
            <button className="hact" type="button" onClick={() => onNavigateToView('wishlist')}>
              <div className="wish-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && <span className="wish-badge">{wishlistCount}</span>}
              </div>
              <span>Обране</span>
            </button>

            <button
              className="hact"
              type="button"
              onClick={() => (user ? onOpenRecipeUpload() : onRequireAuth())}
            >
              <div style={{ position: 'relative' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                {hasRecipe && <span className="recipe-dot" />}
              </div>
              <span>Рецепт</span>
            </button>

            <div id="authContainer">
              {!user ? (
                <button className="profile-hact" type="button" onClick={onOpenAccount}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Акаунт</span>
                </button>
              ) : (
                <div className={`user-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                  <div className="user-info-trigger hact" onClick={() => setIsDropdownOpen((p) => !p)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{user.name}</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div className="dropdown-content">
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenAccount();
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Мій профіль
                      </button>

                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenOrders();
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                          <path d="M3 6h18" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Мої замовлення
                      </button>

                      {user.isAdmin && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onOpenAdmin();
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          Адмін-панель
                        </button>
                      )}

                      <hr />

                      <button
                        className="dropdown-item logout-red"
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          catalog.clearSearch();
                          logout();
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Вийти
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="hact" type="button" onClick={onOpenCart}>
              <div className="cart-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="cart-badge">{cartCount}</span>
              </div>
              <span>Кошик</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="header-nav">
        <div className="container header-nav-inner">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeCategory === item.id ? 'nav-item-active' : ''} ${
                isNavItemFiltered(item.id) ? 'nav-item-filtered' : ''
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <FilterPanels
        activeCategory={activeCategory}
        selectedType={selectedType}
        setSelectedType={handleSelectType}
        rxFilter={rxFilter}
        setRxFilter={handleRxFilter}
        minPrice={minPrice}
        maxPrice={maxPrice}
        handleMinChange={handleMinChange}
        handleMaxChange={handleMaxChange}
        categories={catalog.categories}
        selectedCategoryId={catalog.filters.categoryId}
        onSelectCategory={(id) => {
        catalog.setCategoryId(id);
        onNavigateToView('meds');
        }}
      />
    </header>
  );
};