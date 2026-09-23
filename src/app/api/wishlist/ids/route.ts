import { NextRequest, NextResponse } from 'next/server';
import { WishlistService } from '@/server/services/wishlist.service';

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

    const ids = await WishlistService.getWishlistIds(userId);
    return NextResponse.json(ids);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch wishlist IDs' },
      { status: 500 }
    );
  }
}