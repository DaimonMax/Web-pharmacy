import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/server/services/cart.service';

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

    const items = await CartService.getCartForApi(userId);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}