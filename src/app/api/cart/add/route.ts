import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/server/services/cart.service';

interface AddToCartBody {
  productId: number;
  quantity: number;
  prescriptionId?: number | null;
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

    const body: AddToCartBody = await request.json();

    if (!body.productId || !body.quantity || body.quantity <= 0) {
      return NextResponse.json(
        { message: 'Invalid product or quantity' },
        { status: 400 }
      );
    }

    const result = await CartService.addToCart(
      userId,
      body.productId,
      body.quantity,
      body.prescriptionId ?? null
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
      { message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}