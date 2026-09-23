import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/auth.service';

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterBody = await request.json();

    if (!body.email || !body.password || !body.name || !body.phone) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const result = await AuthService.register(
      body.email,
      body.password,
      body.name,
      body.phone
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to process registration' },
      { status: 500 }
    );
  }
}