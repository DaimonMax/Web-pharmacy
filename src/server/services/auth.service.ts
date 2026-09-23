import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '@/server/db';

export interface RegisterResult {
  success: boolean;
  message: string;
}

export interface LoginResult {
  success: boolean;
  token: string;
  message: string;
}

export class AuthService {
  static validateRegistration(name: string, email: string, password: string, phone: string): string | null {
    if (!name || name.trim() === '') return "A name must be";
    if (/^\d/.test(name)) return "A name can`t start with a symbol or a number";
    if (name.length > 20) return "The name must be no more than 20 elements";
    if (!/^[a-zA-Zа-яА-ЯіІїЇєЄ\s.\-]+$/.test(name)) return "The name includes an unavailable symbol";
    
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Invalid email format";
    if (!password || password.length < 8) return "Password must be at least 8 items";
    
    if (!phone) return "the phone number is necessarily";
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^\+380\d{9}$/.test(cleanPhone)) return "The number format should be: +380XXXXXXXXX";

    return null;
  }

  static async register(email: string, password: string, name: string, phone: string): Promise<RegisterResult> {
    const error = this.validateRegistration(name, email, password, phone);
    if (error) return { success: false, message: error };

    const cleanPhone = phone.replace(/\s/g, '');

    const existEmail = await db.user.findUnique({ where: { email } });
    if (existEmail) return { success: false, message: "The user with this email already exists" };

    const existPhone = await db.user.findUnique({ where: { phone: cleanPhone } });
    if (existPhone) return { success: false, message: "The user with this phone number already exists" };

    await db.user.create({
      data: {
        email,
        passwordHash: this.hashPassword(password),
        name,
        phone: cleanPhone,
        isAdmin: false,
      },
    });

    return { success: true, message: "Registration successful" };
  }

  static async login(email: string, password: string): Promise<LoginResult> {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return { success: false, token: '', message: "User not found" };

    if (user.passwordHash !== this.hashPassword(password)) {
      return { success: false, token: '', message: "Invalid password" };
    }

    const token = this.generateJwtToken(user.id, user.email, user.name, user.isAdmin);
    return { success: true, token, message: "Login successful" };
  }

  private static hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('base64');
  }

  private static generateJwtToken(id: number, email: string, name: string, isAdmin: boolean): string {
    const jwtKey = process.env.JWT_SECRET || 'fallback-secret-key-change-it-in-env';

    return jwt.sign(
      {
        nameIdentifier: id.toString(),
        email,
        name,
        role: isAdmin ? 'Admin' : 'User',
      },
      jwtKey,
      {
        expiresIn: isAdmin ? '2h' : '2d',
        issuer: process.env.JWT_ISSUER || 'WebPharmacy',
        audience: process.env.JWT_AUDIENCE || 'WebPharmacyClient',
      }
    );
  }
}