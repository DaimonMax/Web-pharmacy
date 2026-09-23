import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/order.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userIdHeader = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    const userId = userIdHeader ? Number(userIdHeader) : null;

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { message: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const isAdmin = userRole === 'Admin';
    const order = await OrderService.getById(orderId, userId, isAdmin);

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}