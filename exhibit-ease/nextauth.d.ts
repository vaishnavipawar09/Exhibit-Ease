import { DefaultSession, DefaultUser } from "next-auth";
// Define a role enum

// common interface for JWT and Session
interface IUser extends DefaultUser {
    id: string;
    role?: string;
    phoneNumber?: string | null;
    museumId?: number | null;
}
declare module "next-auth" {
    interface User extends IUser { }
    interface Session {
        user?: User;
    }
}
declare module "next-auth/jwt" {
    interface JWT extends IUser { }
}