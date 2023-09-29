import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import Email from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { options } from "./options";

require('dotenv').config();



const handler = NextAuth(options)
export { handler as GET, handler as POST }
