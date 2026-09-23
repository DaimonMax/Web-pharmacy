import { NextResponse } from 'next/server';
import { DailyDealService } from '@/server/services/dailydeal.service';

export async function GET() {
  try {
    const { product, expiresAt } = await DailyDealService.getCurrentDailyDealWithExpiration();

    if (!product) {
      return NextResponse.json(
        { message: 'Daily deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product, expiresAt });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch daily deal' },
      { status: 500 }
    );
  }
}