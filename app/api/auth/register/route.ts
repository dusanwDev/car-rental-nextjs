// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'User already exists' },
      { status: 400 }
    );
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ user: newUser }, { status: 201 });
}
