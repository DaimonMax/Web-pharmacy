import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/server/services/product.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const searchTerm = searchParams.get('searchTerm');
    const categoryId = searchParams.get('categoryId')
      ? Number(searchParams.get('categoryId'))
      : null;
    const varietyId = searchParams.get('varietyId')
      ? Number(searchParams.get('varietyId'))
      : null;
    const isRecipeRequired = searchParams.get('isRecipeRequired')
      ? searchParams.get('isRecipeRequired') === 'true'
      : null;
    const isForChildren = searchParams.get('isForChildren')
      ? searchParams.get('isForChildren') === 'true'
      : null;
    const priceMin = searchParams.get('priceMin')
      ? Number(searchParams.get('priceMin'))
      : null;
    const priceMax = searchParams.get('priceMax')
      ? Number(searchParams.get('priceMax'))
      : null;

    const products = await ProductService.getAll({
      searchTerm,
      categoryId,
      varietyId,
      isRecipeRequired,
      isForChildren,
      priceMin,
      priceMax,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}