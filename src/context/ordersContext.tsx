'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Order } from '@/shared/types/order';
import {
  fetchMyOrders,
  fetchAllOrdersAdmin,
  updateOrderStatus as updateOrderStatusApi,
  updateOrderAddress as updateOrderAddressApi,
  deleteOrderItem as deleteOrderItemApi,
  AdminOrder,
} from '@/lib/apiServices/ordersApi';

interface OrdersContextValue {
  myOrders: Order[];
  isMyOrdersLoading: boolean;
  refreshMyOrders: () => Promise<void>;

  adminOrders: AdminOrder[];
  isAdminOrdersLoading: boolean;
  refreshAdminOrders: () => Promise<void>;

  updateStatus: (orderId: number, status: string) => Promise<void>;
  updateAddress: (orderId: number, address: string) => Promise<void>;
  removeItem: (orderId: number, productId: number) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isMyOrdersLoading, setIsMyOrdersLoading] = useState(false);

  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>([]);
  const [isAdminOrdersLoading, setIsAdminOrdersLoading] = useState(false);

  const refreshMyOrders = useCallback(async () => {
    setIsMyOrdersLoading(true);
    try {
      const data = await fetchMyOrders();
      setMyOrders(data);
    } catch {
      setMyOrders([]);
    } finally {
      setIsMyOrdersLoading(false);
    }
  }, []);

  const refreshAdminOrders = useCallback(async () => {
    setIsAdminOrdersLoading(true);
    try {
      const data = await fetchAllOrdersAdmin();
      setAdminOrders(data);
    } catch {
      setAdminOrders([]);
    } finally {
      setIsAdminOrdersLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (orderId: number, status: string) => {
      await updateOrderStatusApi(orderId, status);
      await refreshAdminOrders();
    },
    [refreshAdminOrders]
  );

  const updateAddress = useCallback(
    async (orderId: number, address: string) => {
      await updateOrderAddressApi(orderId, address);
      await refreshAdminOrders();
    },
    [refreshAdminOrders]
  );

  const removeItem = useCallback(
    async (orderId: number, productId: number) => {
      await deleteOrderItemApi(orderId, productId);
      await refreshAdminOrders();
    },
    [refreshAdminOrders]
  );

  return (
    <OrdersContext.Provider
      value={{
        myOrders,
        isMyOrdersLoading,
        refreshMyOrders,
        adminOrders,
        isAdminOrdersLoading,
        refreshAdminOrders,
        updateStatus,
        updateAddress,
        removeItem,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}