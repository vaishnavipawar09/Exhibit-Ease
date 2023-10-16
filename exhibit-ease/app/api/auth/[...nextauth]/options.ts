import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth';
import type { NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import { getSession } from "next-auth/react";


export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Email({
            server: {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ''
        })
    ],
    pages: {
        //     signIn: '/auth/signin',
        //     signOut: '/auth/signout',
        //     error: '/auth/error',
        //     verifyRequest: '/auth/verify-request',
        //     newUser: '/auth/new-user'
    },
    theme: {
        colorScheme: "light", // "auto" | "dark" | "light"
        brandColor: "", // Hex color code
        logo: "https://drive.google.com/uc?id=1KL5DqzxMZ6UgPCutbfS0W7oyEPRQoLEj", // Absolute URL to image
        buttonText: "" // Hex color code
    },
    useSecureCookies: false
}