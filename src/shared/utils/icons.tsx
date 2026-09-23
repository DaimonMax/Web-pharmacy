import React from 'react';

export interface NavCategory {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface MedType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const NAV_ITEMS: NavCategory[] = [
  { id: 'all', label: 'Всі ліки' },
  {
    id: 'cats',
    label: 'Категорії',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'medTypes',
    label: 'Типи ліків',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <rect x="7" y="6" width="10" height="12" rx="2" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="11" x2="15" y2="11" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    id: 'kids',
    label: 'Дитячі',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
        <circle cx="12" cy="7" r="4" />
        <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
        <path d="M9 11.5 C9 14 10 16 12 16 C14 16 15 14 15 11.5" />
      </svg>
    ),
  },
  {
    id: 'rxFilter',
    label: 'Наявність рецепту',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: 'priceFilter',
    label: 'Ціна',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
    ),
  },
  {
    id: 'flashNav',
    label: 'Товар дня',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'advice',
    label: 'Поради',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

export const MED_TYPES: MedType[] = [
  {
    id: 'tablets',
    label: 'Таблетки',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <circle cx="12" cy="12" r="9" />
        <line x1="3.6" y1="15" x2="20.4" y2="15" />
      </svg>
    ),
  },
  {
    id: 'capsules',
    label: 'Капсули',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <rect x="3" y="9" width="18" height="6" rx="3" />
        <line x1="12" y1="9" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    id: 'syrups',
    label: 'Сиропи',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <path d="M8 3h8l1 5H7L8 3z" />
        <rect x="6" y="8" width="12" height="13" rx="2" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    id: 'sprays',
    label: 'Спреї',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <rect x="7" y="6" width="7" height="15" rx="2" />
        <path d="M14 9h2a2 2 0 0 1 0 4h-2" />
        <path d="M10 3 L10 6 M14 3 L14 6" />
      </svg>
    ),
  },
  {
    id: 'drops',
    label: 'Краплі',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <path d="M12 2 C12 2 5 10 5 15 a7 7 0 0 0 14 0 C19 10 12 2 12 2z" />
      </svg>
    ),
  },
  {
    id: 'ointments',
    label: 'Мазі',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <rect x="10" y="1.5" width="4" height="2.5" rx="0.6" />
        <path d="M9 4h6v2h-6z" />
        <path d="M7.5 6 h9 l-1.2 12.5 a1 1 0 0 1 -1 0.9 h-3.6 a1 1 0 0 1 -1 -0.9 z" />
      </svg>
    ),
  },
];

export const VARIETY_ICON_MAP: Record<number, string> = {
  1: 'tablets',
  2: 'capsules',
  3: 'syrups',
  4: 'sprays',
  5: 'drops',
  6: 'ointments',
};

export const PROD_ICONS: Record<string, string> = {
  tablets: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" class="prod-img-svg">
    <circle cx="24" cy="24" r="18"/><line x1="8.5" y1="24" x2="39.5" y2="24"/><ellipse cx="24" cy="16" rx="6" ry="3" fill="currentColor" opacity="0.15"/></svg>`,
  capsules: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" class="prod-img-svg">
    <rect x="6" y="18" width="36" height="12" rx="6"/><line x1="24" y1="18" x2="24" y2="30"/><rect x="6" y="18" width="18" height="12" rx="6" fill="currentColor" opacity="0.15"/></svg>`,
  syrups: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" class="prod-img-svg">
    <ellipse cx="24" cy="36" rx="10" ry="6"/><rect x="14" y="20" width="20" height="16" rx="2"/><path d="M19 14h10v6H19z"/>
      <circle cx="24" cy="14" r="2"/><path d="M20 26 q4 3 8 0" stroke-width="1.4"/></svg>`,
  sprays: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" class="prod-img-svg">
    <rect x="14" y="14" width="12" height="26" rx="4"/><path d="M26 20h6a3 3 0 0 1 0 6h-6"/><line x1="32" y1="11" x2="36" y2="8"/>
      <line x1="36" y1="14" x2="40" y2="13"/><line x1="34" y1="18" x2="38" y2="19"/></svg>`,
  drops: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" class="prod-img-svg">
    <path d="M24 6C24 6 10 22 10 32a14 14 0 0 0 28 0C38 22 24 6 24 6z"/><path d="M16 34 q4 4 10 2" stroke-width="1.4" opacity="0.5"/></svg>`,
  ointments: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" class="prod-img-svg">
    <path d="M20 4 L28 4 L30 10 L30 42 Q30 44 24 44 Q18 44 18 42 L18 10 Z"/><line x1="20" y1="4" x2="20" y2="10"/>
      <line x1="23" y1="4" x2="23" y2="10"/><line x1="26" y1="4" x2="26" y2="10"/><line x1="28" y1="4" x2="28" y2="10"/>
        <line x1="18" y1="10" x2="30" y2="10"/><line x1="21" y1="38" x2="27" y2="38"/></svg>`,
  default: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" class="prod-img-svg">
    <circle cx="24" cy="24" r="18"/><line x1="24" y1="14" x2="24" y2="34"/><line x1="14" y1="24" x2="34" y2="24"/></svg>`,
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Стоматологія': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <path d="M8 3C6 3 4 5 4 7.5c0 1.5.5 2.5 1 3.5L7 20h2.5l1-6 1 6H14l2-9c.5-1 1-2 1-3.5C17 5 15 3 13 3c-1 0-2 .5-2.5 1.5C10 3.5 9 3 8 3z"/></svg>`,
  'Застуда': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <circle cx="12" cy="9" r="5"/><path d="M7 15 q-2 1-3 3"/><path d="M17 15 q2 1 3 3"/><path d="M9 19 q3-2 6 0"/></svg>`,
  'Знеболювальні': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <rect x="2" y="9" width="20" height="6" rx="3"/><line x1="12" y1="9" x2="12" y2="15"/><rect x="2" y="9" width="10" height="6" rx="3" fill="currentColor" opacity="0.2"/></svg>`,
  'Дерматологія': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <path d="M8 18 L8 9 Q8 7.5 9.5 7.5 Q11 7.5 11 9 L11 12"/><path d="M11 10 Q11 8.5 12.5 8.5 Q14 8.5 14 10 L14 12"/>
      <path d="M14 11 Q14 9.5 15.5 9.5 Q17 9.5 17 11 L17 15 Q17 19 14 20 L10 20 Q7 20 6 18 L6 14 Q6 12.5 7 12.5 Q8 12.5 8 14"/>
        <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.35" stroke="none"/></svg>`,
  'Шлунок': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <path d="M6 4 Q3 4 3 8 L3 11 Q3 14 6 14 L6 17 Q6 21 10 21 L13 21 Q18 21 19 17 L20 13 Q21 10 19 8 Q17 6 14 7 Q13 8 12 7 Q10 5 6 4z"/>
      <path d="M9 14 Q11 16 14 14" stroke-width="1.3"/></svg>`,
  'Серце': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  'Нервова система': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><path d="M12 7.5 L12 11"/>
      <path d="M12 11 Q8 12 7 15"/><path d="M12 11 Q16 12 17 15"/></svg>`,
  'Вітаміни': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12h6M12 9v6"/></svg>`,
  'Противірусні': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
    <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`,
};

export function getIcon(typeId?: number | null): string {
  if (!typeId) return PROD_ICONS.default;
  const key = VARIETY_ICON_MAP[typeId];
  return key ? PROD_ICONS[key] : PROD_ICONS.default;
}

export function getCategoryIcon(name: string): string {
  return (
    CATEGORY_ICONS[name] ||
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
  );
}

export function getProductImg(imageUrl?: string | null): string | null {
  return imageUrl || null;
}
