import { db } from '@/server/db';
import { Product, Category, Variety, Prisma } from '@prisma/client';

export interface ProductFilterOptions {
  searchTerm?: string | null;
  categoryId?: number | null;
  varietyId?: number | null;
  isRecipeRequired?: boolean | null;
  isForChildren?: boolean | null;
  priceMin?: number | null;
  priceMax?: number | null;
}

export class ProductService {
  static async getAll(options: ProductFilterOptions = {}): Promise<Product[]> {
    const {
      searchTerm,
      categoryId,
      varietyId,
      isRecipeRequired,
      isForChildren,
      priceMin,
      priceMax,
    } = options;

    const whereCondition: Prisma.ProductWhereInput = {};

    if (categoryId !== undefined && categoryId !== null) {
      whereCondition.categoryId = categoryId;
    }

    if (varietyId !== undefined && varietyId !== null) {
      whereCondition.varietyId = varietyId;
    }

    if (isRecipeRequired !== undefined && isRecipeRequired !== null) {
      whereCondition.isRecipeRequired = isRecipeRequired;
    }

    if (isForChildren !== undefined && isForChildren !== null) {
      whereCondition.isForChildren = isForChildren;
    }

    if (
      (priceMin !== undefined && priceMin !== null) ||
      (priceMax !== undefined && priceMax !== null)
    ) {
      whereCondition.price = {};
      if (priceMin !== undefined && priceMin !== null) {
        whereCondition.price.gte = priceMin;
      }
      if (priceMax !== undefined && priceMax !== null) {
        whereCondition.price.lte = priceMax;
      }
    }

    let products = await db.product.findMany({
      where: whereCondition,
      orderBy: {
        price: 'asc', 
      },
    });

    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();

     const nameMatches: typeof products = [];
     const descriptionMatches: typeof products = [];

     for (const p of products) {
       const nameWords = p.name
         .toLowerCase()
         .split(/[\s\-,\.]+/)
         .filter(Boolean);
       const wordNameMatches = nameWords.some((word) => word.startsWith(term));

       if (wordNameMatches) {
         nameMatches.push(p);
         continue; 
       }

       const descriptionWords = p.description
         ? p.description
             .toLowerCase()
             .split(/[\s\-,\.]+/)
             .filter(Boolean)
         : [];
       const wordDescriptionMatches = descriptionWords.some((word) =>
         word.startsWith(term)
       );

       if (wordDescriptionMatches) {
         descriptionMatches.push(p);
       }
     }

     products = [...nameMatches, ...descriptionMatches];
    }

    return products;
  }

  static async getById(id: number): Promise<Product | null> {
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  static async getCategories(): Promise<Category[]> {
    return await db.category.findMany({
      orderBy: { id: 'asc' },
    });
  }

  static async getVarieties(): Promise<Variety[]> {
    return await db.variety.findMany({
      orderBy: { id: 'asc' },
    });
  }
}