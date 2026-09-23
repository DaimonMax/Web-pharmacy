'use client';

import React from 'react';

interface CartPeekTabProps {
  visible: boolean;
  onHover: () => void;
}

export const CartPeekTab: React.FC<CartPeekTabProps> = ({ visible, onHover }) => {
  if (!visible) return null;

  return (
    <button
      type="button"
      className="cart-peek-tab"
      onMouseEnter={onHover}
      aria-label="Відкрити кошик"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};