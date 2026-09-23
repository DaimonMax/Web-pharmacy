import { NextRequest, NextResponse } from 'next/server';
import { PrescriptionService } from '@/server/services/prescription.service';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid prescription ID' },
        { status: 400 }
      );
    }

    const prescription = await PrescriptionService.getById(id);
    if (!prescription) {
      return NextResponse.json(
        { message: 'Prescription not found' },
        { status: 404 }
      );
    }

    const relativePath = prescription.imagePath.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), 'public', relativePath);

    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json(
        { message: 'Image file not found on server' },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to retrieve prescription file' },
      { status: 500 }
    );
  }
}