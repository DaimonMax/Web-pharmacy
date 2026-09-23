import { apiRequest } from '@/lib/api-client';

export interface LoginResponse {
  token: string;
  message: string;
}

export interface RegisterResponse {
  message: string;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function register(
  name: string,
  phone: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: { name, phone, email, password },
  });
}