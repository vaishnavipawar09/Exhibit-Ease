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
    const { email, resetCode, password, needToVerify } = valueToJson;

    try {

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (user && user.password !== null) {
            if (user.resetCode === resetCode) {
                return NextResponse.json({ message: 'verified', user }, { status: 200 });

            } else {
                return NextResponse.json({ error: 'Reset code is incorrect.' }, { status: 400 });

            }
        } else {
            return NextResponse.json({ error: 'User does not exist OR login with your Google/Facebook account.' }, { status: 400 });
        }



    } catch (error) {
        return NextResponse.json({ error: 'User does not exist OR login with your Google/Facebook account.' }, { status: 500 });
    }
};
