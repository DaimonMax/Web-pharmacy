import { apiRequest } from '@/lib/api-client';
import { Product } from '@/shared/types/product'; 

export function fetchWishlist(): Promise<Product[]> {
  return apiRequest<Product[]>('/wishlist');
}

export function fetchWishlistIds(): Promise<number[]> {
  return apiRequest<number[]>('/wishlist/ids');
}

export function toggleWishlist(productId: number): Promise<{ added: boolean; message: string }> {
  return apiRequest<{ added: boolean; message: string }>(`/wishlist/toggle/${productId}`, {
    method: 'POST',
  });
}