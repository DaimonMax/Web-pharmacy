'use client';

import { useCallback } from 'react';
import { useCart } from '@/context/cartContext';
import { placeOrder as placeOrderApi } from '@/lib/apiServices/ordersApi';

export function usePlaceOrder() {
  const { refresh: refreshCart } = useCart();

  return useCallback(
    async (deliveryAddress: string) => {
      await placeOrderApi(deliveryAddress);
      await refreshCart();
    },
    [refreshCart]
  );
}