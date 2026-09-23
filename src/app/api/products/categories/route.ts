import { NextResponse } from 'next/server';
import { ProductService } from '@/server/services/product.service';

export async function GET() {
  try {
    const categories = await ProductService.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}