import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Email from "next-auth/providers/email";
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions, User as NextAuthUser, Account as NextAuthAccount, Profile, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface ExtendedUser extends NextAuthUser {
    role: string;
    museumId?: number | null;
}

interface ExtendedSession extends Session {
    user: ExtendedUser;
}


export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers:
        [
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
            }),
            CredentialsProvider({
                name: 'Credentials',
                credentials: {
                    role: { label: "Role", type: "text" },
                    code: { label: "Code", type: "text" }
                },
                authorize: async (credentials) => {
                    if (!credentials) {
                        return null;
                    }
                    let foundUser;

                    foundUser = await prisma.user.findUnique({
                        where: {
                            code: credentials.code
                        }
                    });

                    if (!foundUser) return null;
                    if (foundUser.role !== credentials.role) return null;

                    const user: ExtendedUser = {
                        id: foundUser.id,
                        name: foundUser.name,
                        email: foundUser.email,
                        image: null,
                        role: credentials.role
                    };

                    if (credentials.role === 'Manager' || credentials.role === 'Employee') {
                        user.museumId = foundUser.museumId;
                    }

                    return user;
                }
            }
            ),
        ],
    theme: {
        colorScheme: "light", // "auto" | "dark" | "light"
        brandColor: "", // Hex color code
        logo: "https://drive.google.com/uc?id=1KL5DqzxMZ6UgPCutbfS0W7oyEPRQoLEj", // Absolute URL to image
        buttonText: "" // Hex color code
    },
    useSecureCookies: false,
}