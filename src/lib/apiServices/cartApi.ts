import { apiRequest } from '@/lib/api-client';

export interface CartResponseItem {
  id: number;
  productId: number;
  quantity: number;
  prescriptionId: number | null;
  productName: string;
  price: number; 
  varietyId: number;
  imageUrl: string;
}

export function fetchCart(): Promise<CartResponseItem[]> {
  return apiRequest<CartResponseItem[]>('/cart');
}

export function addToCart(
  productId: number,
  quantity: number,
  prescriptionId?: number | null
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/cart/add', {
    method: 'POST',
    body: { productId, quantity, prescriptionId: prescriptionId ?? null },
  });
}

export function updateCartQuantity(
  cartItemId: number,
  quantity: number
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/cart/update', {
    method: 'PUT',
    body: { cartItemId, quantity },
  });
}

export function removeFromCart(itemId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/cart/${itemId}`, {
    method: 'DELETE',
  });
}