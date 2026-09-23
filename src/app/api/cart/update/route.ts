import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/server/services/cart.service';

interface UpdateCartBody {
  cartItemId: number;
  quantity: number;
}

export async function PUT(request: NextRequest) {
  try {
    const userIdHeader = request.headers.get('x-user-id');
    const userId = userIdHeader ? Number(userIdHeader) : null;

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body: UpdateCartBody = await request.json();

    if (!body.cartItemId || body.quantity === undefined || body.quantity < 0) {
      return NextResponse.json(
        { message: 'Invalid cart item ID or quantity' },
        { status: 400 }
      );
    }

    const result = await CartService.updateQuantity(
      body.cartItemId,
      userId,
      body.quantity
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update item quantity' },
      { status: 500 }
    );
  }
}