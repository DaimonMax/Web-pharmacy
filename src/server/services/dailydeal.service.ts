import { db } from '@/server/db';
import { Product } from '@prisma/client';

export interface DailyDealResult {
  product: Product | null;
  expiresAt: number;
}

const DEAL_TIMEZONE = 'Europe/Kyiv';

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const { type, value } of parts) map[type] = value;
  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );
  return asUTC - date.getTime();
}

function getNextMidnightUnixSeconds(reference: Date = new Date()): number {
  const offsetMs = getTimeZoneOffsetMs(reference, DEAL_TIMEZONE);
  const asKyiv = new Date(reference.getTime() + offsetMs);
  const nextMidnightAsKyiv = new Date(
    Date.UTC(asKyiv.getUTCFullYear(), asKyiv.getUTCMonth(), asKyiv.getUTCDate() + 1, 0, 0, 0, 0)
  );
  const nextMidnightUTCMs = nextMidnightAsKyiv.getTime() - offsetMs;
  return Math.floor(nextMidnightUTCMs / 1000);
}

export class DailyDealService {
  static async GetCurrentDailyDeal(): Promise<Product | null> {
    const result = await this.getCurrentDailyDealWithExpiration();
    return result.product;
  }
 
  static async getCurrentDailyDealWithExpiration(): Promise<DailyDealResult> {
    const currentUnix = Math.floor(Date.now() / 1000);
 
    let currentDailyDeal = await db.dailyDeal.findFirst({
      where: {
        expiresAtUnix: {
          gt: currentUnix,
        },
      },
      orderBy: {
        expiresAtUnix: 'desc',
      },
    });
 
    if (!currentDailyDeal || currentDailyDeal.expiresAtUnix <= currentUnix) {
      currentDailyDeal = await this.changeDailyDeal();
    }
 
    const product = await db.product.findUnique({
      where: { id: currentDailyDeal.productId },
    });
 
    return {
      product,
      expiresAt: currentDailyDeal.expiresAtUnix,
    };
  }

  private static async changeDailyDeal() {
    const products = await db.product.findMany();

    if (products.length === 0) {
      throw new Error('Database is empty. Unable to select daily deal.');
    }

    const randomIndex = Math.floor(Math.random() * products.length);
    const selectedProduct = products[randomIndex];
    const expiresAtUnix = getNextMidnightUnixSeconds();
 
    const newDailyDeal = await db.dailyDeal.create({
      data: {
        productId: selectedProduct.id,
        expiresAtUnix: expiresAtUnix,
      },
    });
 
    return newDailyDeal;
  }
}