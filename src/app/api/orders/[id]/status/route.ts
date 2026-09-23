import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/order.service';

interface UpdateStatusBody {
  status: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'Admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin rights required.' },
        { status: 403 }
      );
    }

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const body: UpdateStatusBody = await request.json();

    const result = await OrderService.updateStatus(id, body.status);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update order status' },
      { status: 500 }
    );
  }
}