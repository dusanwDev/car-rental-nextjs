// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
// import { hash } from 'bcrypt';
// import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  // Temporarily disabled - migrate to Supabase auth
  return NextResponse.json(
    { error: 'Registration temporarily disabled - use Supabase auth' },
    { status: 503 }
  );
}
