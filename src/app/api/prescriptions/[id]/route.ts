import { NextRequest, NextResponse } from 'next/server';
import { PrescriptionService } from '@/server/services/prescription.service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userIdHeader = request.headers.get('x-user-id');
    const userId = userIdHeader ? Number(userIdHeader) : null;

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid prescription ID' },
        { status: 400 }
      );
    }

    const result = await PrescriptionService.delete(id, userId);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete prescription' },
      { status: 500 }
    );
  }
}