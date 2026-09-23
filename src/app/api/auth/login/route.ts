import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/auth.service';

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await AuthService.login(body.email, body.password);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      token: result.token,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to process login' },
      { status: 500 }
    );
  }
}