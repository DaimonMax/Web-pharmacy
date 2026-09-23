'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import {
  fetchCart,
  addToCart as addToCartApi,
  updateCartQuantity,
  removeFromCart as removeFromCartApi,
  CartResponseItem,
} from '@/lib/apiServices/cartApi';

interface CartContextValue {
  items: CartResponseItem[];
  cartCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  add: (productId: number, quantity: number, prescriptionId?: number | null) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  remove: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCart();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setItems([]);
    }
  }, [user, refresh]);

  const add = useCallback(
    async (productId: number, quantity: number, prescriptionId?: number | null) => {
      await addToCartApi(productId, quantity, prescriptionId);
      await refresh();
    },
    [refresh]
  );

  const updateQuantity = useCallback(
    async (cartItemId: number, quantity: number) => {
      await updateCartQuantity(cartItemId, quantity);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (itemId: number) => {
      await removeFromCartApi(itemId);
      await refresh();
    },
    [refresh]
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, cartCount, isLoading, refresh, add, updateQuantity, remove }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}