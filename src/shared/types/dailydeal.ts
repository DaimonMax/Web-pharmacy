import { Product } from '@/shared/types/product';

export interface DailyDeal{
    id: number
    productId: number
    expiresAtUnix: number
    product?: Product
}