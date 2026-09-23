import { apiRequest } from '@/lib/api-client';
import { Order } from '@/shared/types/order'; 

export interface AdminOrder extends Order {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  Unconfirmed: 'Не підтверджено',
  Confirmed: 'Підтверджено',
  Delivering: 'Доставляється',
  Delivered: 'Доставлено',
  Payed: 'Проплачено',
  Cancelled: 'Скасовано',
};

export const ORDER_STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS);

export function fetchMyOrders(): Promise<Order[]> {
  return apiRequest<Order[]>('/orders');
}

export function placeOrder(deliveryAddress: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/orders/place', {
    method: 'POST',
    body: { deliveryAddress },
  });
}

export function fetchAllOrdersAdmin(): Promise<AdminOrder[]> {
  return apiRequest<AdminOrder[]>('/orders/all');
}

export function updateOrderStatus(orderId: number, status: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: { status },
  });
}

export function updateOrderAddress(
  orderId: number,
  deliveryAddress: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/orders/${orderId}/address`, {
    method: 'PUT',
    body: { deliveryAddress },
  });
}

export function deleteOrderItem(orderId: number, productId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/orders/${orderId}/items/${productId}`, {
    method: 'DELETE',
  });
}