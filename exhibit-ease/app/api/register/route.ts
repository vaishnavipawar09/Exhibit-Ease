import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

type PrismaError = {
  code: string;
  meta?: {
    target?: string[];
  };
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  let passedValue = await new Response(req.body).text();
  let valueToJson = JSON.parse(passedValue);
  const { email, name, phoneNumber, password } = valueToJson;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        phoneNumber: phoneNumber || null,
        password: hashedPassword,
        role: 'C',
      },
    });

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    const prismaError = error as PrismaError;
    if (prismaError.code === 'P2002' && prismaError.meta && prismaError.meta.target) {
      if (prismaError.meta.target.includes('phoneNumber')) {
        return NextResponse.json({ error: 'Phone number is already in use.' }, { status: 400 });
      } else if (prismaError.meta.target.includes('email')) {
        return NextResponse.json({ error: 'Email is already in use.' }, { status: 400 });
      }
    }
    return NextResponse.json({ error: 'An error occurred during registration.' }, { status: 500 });
  }
};
