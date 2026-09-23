import { NextRequest, NextResponse } from 'next/server';
import { PrescriptionService } from '@/server/services/prescription.service';

export async function GET(request: NextRequest) {
  try {
    const userIdHeader = request.headers.get('x-user-id');
    const userId = userIdHeader ? Number(userIdHeader) : null;

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const prescriptions = await PrescriptionService.getByUser(userId);
    return NextResponse.json(prescriptions);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}