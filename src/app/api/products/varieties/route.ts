import { NextResponse } from 'next/server';
import { ProductService } from '@/server/services/product.service';

export async function GET() {
  try {
    const varieties = await ProductService.getVarieties();
    return NextResponse.json(varieties);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch varieties' },
      { status: 500 }
    );
  }
}