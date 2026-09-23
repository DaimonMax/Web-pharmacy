import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/order.service';

export async function GET(request: NextRequest) {
  try {
    const userIdHeader = request.headers.get('x-user-id');
    const userId = userIdHeader ? Number(userIdHeader) : null;

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const orders = await OrderService.getOrders(userId, false);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}