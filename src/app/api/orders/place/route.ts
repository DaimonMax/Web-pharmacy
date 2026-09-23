import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/order.service';

interface AddressBody {
  deliveryAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const userIdHeader = request.headers.get('x-user-id');
    const userId = userIdHeader ? Number(userIdHeader) : null;

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body: AddressBody = await request.json();

    if (!body.deliveryAddress || !body.deliveryAddress.trim()) {
      return NextResponse.json(
        { message: 'Provide delivery address' },
        { status: 400 }
      );
    }

    const result = await OrderService.createOrder(userId, body.deliveryAddress.trim());

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    );
  }
}