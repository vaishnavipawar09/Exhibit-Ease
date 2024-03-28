import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

type PrismaError = {
    code: string;
    meta?: {
        target?: string[];
    };
};

export async function POST(req: NextRequest, res: NextResponse) {
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { email, password } = valueToJson;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: hashedPassword
            }
        });
        return NextResponse.json({ message: 'updated', user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'User does not exist OR login with your Google/Facebook account.' }, { status: 500 });
    }
};
