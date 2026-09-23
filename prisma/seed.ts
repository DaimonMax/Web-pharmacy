import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('base64');
}

async function main() {
  console.log('--- Creating database ---');

  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  const adminPhone = process.env.DEFAULT_ADMIN_PHONE || '+380000000000';

  if (!adminEmail || !adminPassword) {
    console.warn('DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD are not set in .env — skipping admin creation.');
  } else {
    try {
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        await prisma.user.create({
          data: {
            email: adminEmail,
            passwordHash: hashPassword(adminPassword),
            name: 'Admin',
            phone: adminPhone,
            isAdmin: true,
          },
        });
        console.log('Admin account created successfully!');
      } else {
        console.log('ℹAdmin account already exists.');
      }
    } catch (e) {
      console.error('Error creating admin:', e);
    }
  }

  const productsCount = await prisma.product.count();

  if (productsCount === 0) {
    const jsonPath = path.join(process.cwd(), 'data.json');

    if (fs.existsSync(jsonPath)) {
      try {
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(rawData);

        const categories = data.Categories || data.categories || [];
        const varieties = data.Varieties || data.varieties || [];
        const products = data.Products || data.products || [];

        if (categories.length) {
          console.log(`Importing ${categories.length} categories...`);
          for (const cat of categories) {
            await prisma.category.upsert({
              where: { id: cat.Id ?? cat.id },
              update: {},
              create: {
                id: cat.Id ?? cat.id,
                name: cat.Name ?? cat.name,
              },
            });
          }
        }

        if (varieties.length) {
          console.log(`Importing ${varieties.length} varieties...`);
          for (const varItem of varieties) {
            await prisma.variety.upsert({
              where: { id: varItem.Id ?? varItem.id },
              update: {},
              create: {
                id: varItem.Id ?? varItem.id,
                name: varItem.Name ?? varItem.name,
              },
            });
          }
        }

        if (products.length) {
          console.log(`Importing ${products.length} products...`);
          for (const prod of products) {
            await prisma.product.upsert({
              where: { id: prod.Id ?? prod.id },
              update: {},
              create: {
                id: prod.Id ?? prod.id,
                name: prod.Name ?? prod.name,
                description: prod.Description ?? prod.description ?? '',
                composition: prod.Composition ?? prod.composition ?? '',
                manufacturer: prod.Manufacturer ?? prod.manufacturer ?? '',
                price: prod.Price ?? prod.price,
                categoryId: prod.CategoryId ?? prod.categoryId,
                varietyId: prod.VarietyId ?? prod.varietyId,
                isRecipeRequired: prod.IsRecipeRequired ?? prod.isRecipeRequired ?? false,
                isForChildren: prod.IsForChildren ?? prod.isForChildren ?? false,
                imageUrl: prod.ImageUrl ?? prod.imageUrl ?? null,
              },
            });
          }
        }

        console.log('All data from data.json has been loaded successfully!');
      } catch (error) {
        console.error('Error parsing or writing data.json:', error);
      }
    } else {
      console.warn(`File not found at path: ${jsonPath}`);
    }
  } else {
    console.log('Products already exist in the database, skipping import.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
