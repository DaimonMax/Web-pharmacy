import { db } from '@/server/db';
import { Product } from '@prisma/client';

export class WishlistService {
  static async getWishlist(userId: number): Promise<Product[]> {
    const items = await db.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
    return items
      .map((item) => item.product)
      .filter((product): product is Product => product !== null);
  }

  static async toggle(userId: number, productId: number): Promise<boolean> {
    const existing = await db.wishlistItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existing) {
      await db.wishlistItem.delete({
        where: { id: existing.id },
      });
      return false;
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    await db.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    return true;
  }

  static async getWishlistIds(userId: number): Promise<number[]> {
    const items = await db.wishlistItem.findMany({
      where: { userId },
      select: {
        productId: true,
      },
    });

    return items.map((item) => item.productId);
  }
}