import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/server/db';
import { Prescription } from '@prisma/client';

export interface ServiceResult {
  success: boolean;
  message: string;
}

export class PrescriptionService {
  private static readonly ALLOWED_EXTENSIONS = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
    '.heic',
    '.heif',
  ];

  static async getByUser(userId: number): Promise<Prescription[]> {
    return await db.prescription.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  static async upload(
    userId: number,
    file: File,
    title: string
  ): Promise<ServiceResult> {
    if (!title || title.trim() === '') {
      return { success: false, message: 'Please provide a prescription title' };
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      return { success: false, message: 'Only image files are allowed' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const photoHash = crypto.createHash('md5').update(buffer).digest('hex').toLowerCase();

    const existPhoto = await db.prescription.findFirst({
      where: {
        userId,
        photoHash,
      },
    });

    if (existPhoto) {
      return {
        success: false,
        message: `This prescription has already been uploaded under the title "${existPhoto.title}"`,
      };
    }

    const uploadFolder = path.join(process.cwd(), 'public', 'images', 'prescriptions');
    
    await fs.mkdir(uploadFolder, { recursive: true });

    const fileName = `${userId}_${crypto.randomUUID()}${extension}`;
    const filePath = path.join(uploadFolder, fileName);

    await fs.writeFile(filePath, buffer);

    await db.prescription.create({
      data: {
        userId,
        title: title.trim(),
        imagePath: `/images/prescriptions/${fileName}`,
        photoHash,
        uploadedAt: new Date(),
      },
    });

    return { success: true, message: 'Prescription uploaded successfully' };
  }

  static async delete(prescriptionId: number, userId: number): Promise<ServiceResult> {
    const prescription = await db.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      return { success: false, message: 'Prescription does not exist' };
    }

    if (prescription.userId !== userId) {
      return { success: false, message: 'Access denied: this is not your prescription' };
    }

    const relativePath = prescription.imagePath.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), 'public', relativePath);

    try {
      await fs.unlink(fullPath);
    } catch {}

    await db.prescription.delete({
      where: { id: prescriptionId },
    });

    return { success: true, message: 'Prescription deleted successfully' };
  }

  static async getById(id: number): Promise<Prescription | null> {
    return await db.prescription.findUnique({
      where: { id },
    });
  }
}