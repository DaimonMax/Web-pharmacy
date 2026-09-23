import { db } from '@/server/db';
import { DailyDealService } from './dailydeal.service';

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

export interface ServiceResult {
  success: boolean;
  message: string;
}

export class CartService {
  static async getCartForApi(userId: number): Promise<CartResponseItem[]> {
    const items = await db.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    let dailyDealProductId = 0;
    try {
      const dailyProduct = await DailyDealService.GetCurrentDailyDeal();
      dailyDealProductId = dailyProduct?.id || 0;
    } catch {}

    return items.map((item) => {
      const product = item.product;
      let finalPrice = 0;

      if (product) {
        finalPrice =
          product.id === dailyDealProductId
            ? Math.round(product.price * 0.7)
            : product.price;
      }

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        prescriptionId: item.prescriptionId,
        productName: product?.name || '',
        price: finalPrice,
        varietyId: product?.varietyId || 0,
        imageUrl: product?.imageUrl || '',
      };
    });
  }

  static async addToCart(
    userId: number,
    productId: number,
    quantity: number,
    prescriptionId?: number | null
  ): Promise<ServiceResult> {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    if (product.isRecipeRequired) {
      if (!prescriptionId) {
        return { success: false, message: 'Prescription is required for this product' };
      }

      const prescription = await db.prescription.findUnique({
        where: { id: prescriptionId },
      });

      if (!prescription) {
        return { success: false, message: 'Prescription not found' };
      }

      if (prescription.userId !== userId) {
        return { success: false, message: 'This prescription belongs to another user' };
      }
    }

    const existing = await db.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return { success: true, message: 'Cart updated successfully' };
    }

    await db.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
        prescriptionId: prescriptionId || null,
      },
    });

    return { success: true, message: 'Product added to cart' };
  }

  static async removeFromCart(itemId: number, userId: number): Promise<ServiceResult> {
    const item = await db.cartItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return { success: false, message: 'Item not found' };
    }

    if (item.userId !== userId) {
      return { success: false, message: 'Access denied' };
    }

    await db.cartItem.delete({ where: { id: itemId } });
    return { success: true, message: 'Product removed from cart' };
  }

  static async updateQuantity(
    itemId: number,
    userId: number,
    quantity: number
  ): Promise<ServiceResult> {
    const item = await db.cartItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return { success: false, message: 'Item not found' };
    }

    if (item.userId !== userId) {
      return { success: false, message: 'Access denied' };
    }

    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id: itemId } });
      return { success: true, message: 'Product removed from cart' };
    }

    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return { success: true, message: 'Quantity updated successfully' };
  }

  static async clearCart(userId: number): Promise<void> {
    await db.cartItem.deleteMany({
      where: { userId },
    });
  }
}