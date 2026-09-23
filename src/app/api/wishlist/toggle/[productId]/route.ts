import { NextRequest, NextResponse } from 'next/server';
import { WishlistService } from '@/server/services/wishlist.service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
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

    const { productId: productIdParam } = await params;
    const productId = Number(productIdParam);
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const added = await WishlistService.toggle(userId, productId);

    return NextResponse.json({
      added,
      message: added
        ? 'Added to wishlist'
        : 'Removed from wishlist',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}