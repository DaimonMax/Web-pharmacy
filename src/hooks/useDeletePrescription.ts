'use client';

import { useCallback } from 'react';
import { useCart } from '@/context/cartContext';
import { usePrescriptions } from '@/context/prescriptionContext';

export function useDeletePrescription() {
  const { remove: removePrescription, attachedPrescriptions } = usePrescriptions();
  const { items: cartItems, remove: removeCartItem } = useCart();

  return useCallback(
    async (prescriptionId: number) => {
      const affectedProductIds = Object.entries(attachedPrescriptions)
        .filter(([, rxId]) => rxId === prescriptionId)
        .map(([productId]) => Number(productId));
      await removePrescription(prescriptionId);

      for (const productId of affectedProductIds) {
        const cartItem = cartItems.find((item) => item.productId === productId);
        if (cartItem) {
          await removeCartItem(cartItem.id);
        }
      }
    },
    [attachedPrescriptions, removePrescription, cartItems, removeCartItem]
  );
}