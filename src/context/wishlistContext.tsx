'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import { fetchWishlist, fetchWishlistIds, toggleWishlist as toggleWishlistApi } from '@/lib/apiServices/wishlistApi';
import { Product } from '@/shared/types/product'; 

interface WishlistContextValue {
  wishlistIds: number[];
  wishlistCount: number;
  wishlistItems: Product[];
  isItemsLoading: boolean;
  isWished: (productId: number) => boolean;
  refreshItems: () => Promise<void>; 
  toggle: (productId: number) => Promise<{ added: boolean }>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isItemsLoading, setIsItemsLoading] = useState(false);

  const hasLoadedItemsRef = useRef(false);

  const refreshIds = useCallback(async () => {
    try {
      const ids = await fetchWishlistIds();
      setWishlistIds(ids);
    } catch {
      setWishlistIds([]);
    }
  }, []);

  const refreshItems = useCallback(async () => {
    setIsItemsLoading(true);
    try {
      const items = await fetchWishlist();
      setWishlistItems(items);
      hasLoadedItemsRef.current = true;
    } catch {
      setWishlistItems([]);
    } finally {
      setIsItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshIds();
    } else {
      setWishlistIds([]);
      setWishlistItems([]);
      hasLoadedItemsRef.current = false;
    }
  }, [user, refreshIds]);

  const isWished = useCallback((productId: number) => wishlistIds.includes(productId), [wishlistIds]);

  const toggle = useCallback(
    async (productId: number) => {
      const result = await toggleWishlistApi(productId);
      await refreshIds();
      if (hasLoadedItemsRef.current) {
        await refreshItems();
      }
      return { added: result.added };
    },
    [refreshIds, refreshItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        wishlistItems,
        isItemsLoading,
        isWished,
        refreshItems,
        toggle,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}