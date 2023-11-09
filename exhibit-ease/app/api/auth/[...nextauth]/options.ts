import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from 'bcryptjs';
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions, User as NextAuthUser, Account as NextAuthAccount, Profile, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UseCustomerLogin, UseNonCustomerLogin } from "@/lib/exceptions";

interface User extends NextAuthUser {
    role: string;
}

export const options: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: 'C'
                }
            }
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: 'C'
                }
            }
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                if (credentials) {
                    const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(credentials.email);

                    let user;

                    if (isEmail) {
                        user = await prisma.user.findUnique({
                            where: { email: credentials.email },
                        });
                    } else {
                        user = await prisma.user.findUnique({
                            where: { phoneNumber: credentials.email },
                        });
                    }

                    if (user && user.password && await bcrypt.compare(credentials.password, user.password)) {
                        if (credentials.role === 'C' && user.role !== 'C') {
                            throw new UseNonCustomerLogin();
                        }
                        if (credentials.role === 'N' && user.role == 'C') {
                            throw new UseCustomerLogin();
                        }
                        return user
                    } else {
                        return null
                    }
                }
                return null
            }
        })
    ],
    theme: {
        colorScheme: "light", // "auto" | "dark" | "light"
        brandColor: "", // Hex color code
        logo: "https://drive.google.com/uc?id=1KL5DqzxMZ6UgPCutbfS0W7oyEPRQoLEj", // Absolute URL to image
        buttonText: "" // Hex color code
    },
    pages: {
        signIn: '/auth/signin',
    },
    useSecureCookies: false,
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.role = token.role
                session.user.phoneNumber = token.phoneNumber
                session.user.museumId = token.museumId
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.phoneNumber = user.phoneNumber;
                token.museumId = user.museumId;
            }
            return token;
        },
    }
}