import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/server/services/cart.service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const userIdHeader = request.headers.get('x-user-id');
    const userId = userIdHeader ? Number(userIdHeader) : null;

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { itemId: itemIdParam } = await params;
    const itemId = Number(itemIdParam);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { message: 'Invalid cart item ID' },
        { status: 400 }
      );
    }

    const result = await CartService.removeFromCart(itemId, userId);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}