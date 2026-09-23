import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/order.service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'Admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin rights required.' },
        { status: 403 }
      );
    }

    const { id: idParam, productId: productIdParam } = await params;
    const id = Number(idParam);
    const productId = Number(productIdParam);

    if (isNaN(id) || isNaN(productId)) {
      return NextResponse.json(
        { message: 'Invalid order or product ID' },
        { status: 400 }
      );
    }

    const result = await OrderService.deleteOrderItem(id, productId);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete order item' },
      { status: 500 }
    );
  }
}