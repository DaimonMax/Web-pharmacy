import { db } from '@/server/db';
import { CartService } from './cart.service';
import { DailyDealService } from './dailydeal.service';

export const OrderStatus = {
  unconfirmed: 'Unconfirmed',
  confirmed: 'Confirmed',
  delivering: 'Delivering',
  delivered: 'Delivered',
  payed: 'Payed',
  cancelled: 'Cancelled',
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export interface ServiceResult {
  success: boolean;
  message: string;
}

export class OrderService {
  static async getOrders(userId: number, isAdmin: boolean) {
    if (isAdmin) {
      return this.getAllOrdersForAdmin();
    }

    return await db.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(orderId: number, userId: number, isAdmin: boolean) {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return null;

    if (!isAdmin && order.userId !== userId) {
      return null;
    }

    return order;
  }

  static async createOrder(
    userId: number,
    deliveryAddress: string
  ): Promise<ServiceResult> {
    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    let dailyDealProductId = 0;
    try {
      const dailyProduct = await DailyDealService.GetCurrentDailyDeal();
      dailyDealProductId = dailyProduct?.id || 0;
    } catch {}

    const orderItemsData: Array<{
      productId: number;
      productName: string;
      quantity: number;
      price: number;
      prescriptionId: number | null;
    }> = [];

    let totalPrice = 0;
    let needRecipe = false;

    for (const cartItem of cartItems) {
      const product = cartItem.product;
      if (!product) {
        return {
          success: false,
          message: `Product ${cartItem.productId} not found`,
        };
      }

      if (product.isRecipeRequired) {
        needRecipe = true;
      }

      const price =
        product.id === dailyDealProductId
          ? Math.round(product.price * 0.7)
          : product.price;

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        quantity: cartItem.quantity,
        price,
        prescriptionId: cartItem.prescriptionId,
      });

      totalPrice += price * cartItem.quantity;
    }

    await db.order.create({
      data: {
        userId,
        createdAt: new Date(),
        status: needRecipe ? OrderStatus.unconfirmed : OrderStatus.confirmed,
        totalPrice,
        deliveryAddress,
        items: {
          create: orderItemsData,
        },
      },
    });

    await CartService.clearCart(userId);

    return { success: true, message: 'Order created successfully' };
  }

  static async updateStatus(
    orderId: number,
    status: string
  ): Promise<ServiceResult> {
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status as OrderStatusType)) {
      return { success: false, message: 'Invalid order status' };
    }

    await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    return { success: true, message: 'Order status updated successfully' };
  }

  static async getAllOrdersForAdmin() {
    return await db.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateAddress(
    orderId: number,
    newAddress: string
  ): Promise<ServiceResult> {
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    await db.order.update({
      where: { id: orderId },
      data: { deliveryAddress: newAddress },
    });

    return { success: true, message: 'Delivery address updated successfully' };
  }

  static async deleteOrderItem(
    orderId: number,
    productId: number
  ): Promise<ServiceResult> {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    const targetItem = order.items.find((item) => item.productId === productId);
    if (!targetItem) {
      return { success: false, message: 'Product not found in this order' };
    }

    await db.orderItem.delete({
      where: { id: targetItem.id },
    });

    const remainingItems = order.items.filter(
      (item) => item.productId !== productId
    );

    const newTotalPrice = remainingItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newStatus =
      remainingItems.length === 0 ? OrderStatus.cancelled : order.status;

    await db.order.update({
      where: { id: orderId },
      data: {
        totalPrice: newTotalPrice,
        status: newStatus,
      },
    });

    return {
      success: true,
      message: 'Product successfully removed from order',
    };
  }
}