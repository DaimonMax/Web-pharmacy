import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/order.service';

export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');

    if (userRole !== 'Admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin rights required.' },
        { status: 403 }
      );
    }

    const orders = await OrderService.getAllOrdersForAdmin();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch all orders' },
      { status: 500 }
    );
  }
}