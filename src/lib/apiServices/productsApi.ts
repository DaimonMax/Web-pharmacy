import { apiRequest } from '@/lib/api-client';
import { Product } from '@/shared/types/product'; 
import { Category } from '@/shared/types/category'; 
import { Variety } from '@/shared/types/variety'; 

export interface ProductFilters {
  searchTerm?: string;
  categoryId?: number | null;
  varietyId?: number | null;
  isRecipeRequired?: boolean | null; 
  isForChildren?: boolean; 
  priceMin?: number;
  priceMax?: number;
}

export function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();

  if (filters.searchTerm) params.set('searchTerm', filters.searchTerm);
  if (filters.categoryId != null) params.set('categoryId', String(filters.categoryId));
  if (filters.varietyId != null) params.set('varietyId', String(filters.varietyId));
  if (filters.isRecipeRequired === true) params.set('isRecipeRequired', 'true');
  if (filters.isRecipeRequired === false) params.set('isRecipeRequired', 'false');
  if (filters.isForChildren) params.set('isForChildren', 'true');
  if (filters.priceMin != null) params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax != null) params.set('priceMax', String(filters.priceMax));

  const qs = params.toString();
  return apiRequest<Product[]>(`/products${qs ? '?' + qs : ''}`);
}

export function fetchProductById(id: number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`);
}

export function fetchCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/products/categories');
}

export function fetchVarieties(): Promise<Variety[]> {
  return apiRequest<Variety[]>('/products/varieties');
}

export interface DailyDealResponse {
  product: Product;
  expiresAt: number; 
}

export function fetchDailyDeal(): Promise<DailyDealResponse> {
  return apiRequest<DailyDealResponse>('/dailydeal');
}