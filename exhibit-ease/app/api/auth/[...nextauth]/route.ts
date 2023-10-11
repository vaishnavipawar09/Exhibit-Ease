import NextAuth from "next-auth"
import { options } from "./options";

require('dotenv').config();



const handler = NextAuth(options)
export { handler as GET, handler as POST }
