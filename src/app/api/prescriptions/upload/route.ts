import { NextRequest, NextResponse } from 'next/server';
import { PrescriptionService } from '@/server/services/prescription.service';

export async function POST(request: NextRequest) {
  try {
    const userIdHeader = request.headers.get('x-user-id');
    const userId = userIdHeader ? Number(userIdHeader) : null;

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || 'Prescription';

    if (!file || file.size === 0) {
      return NextResponse.json(
        { message: 'No file selected' },
        { status: 400 }
      );
    }

    const result = await PrescriptionService.upload(userId, file, title);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to upload prescription' },
      { status: 500 }
    );
  }
}