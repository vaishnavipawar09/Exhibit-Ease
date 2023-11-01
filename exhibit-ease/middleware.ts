import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "M") {
            const redirectUrl = `${req.nextUrl.origin}/not-found?message=${encodeURIComponent("Admin access only.")}`;
            return NextResponse.redirect(redirectUrl);
        }
        if (req.nextUrl.pathname.startsWith("/employee") && req.nextauth.token?.role !== "M") {
            const redirectUrl = `${req.nextUrl.origin}/not-found?message=${encodeURIComponent("Employee access only.")}`;
            return NextResponse.redirect(redirectUrl);
        }
        if (req.nextUrl.pathname.startsWith("/booking") && req.nextauth.token?.role !== "C") {
            console.log(req.nextauth.token?.role)
            const redirectUrl = `${req.nextUrl.origin}/not-found?message=${encodeURIComponent("Customer access only.")}`;
            return NextResponse.redirect(redirectUrl);
        }

        if (req.nextUrl.pathname.startsWith("/support") && req.nextauth.token?.role !== "C" && req.nextauth.token?.role !== "S") {
            const redirectUrl = `${req.nextUrl.origin}/not-found?message=${encodeURIComponent("Customer and Support access only.")}`;
            return NextResponse.redirect(redirectUrl);
        }
    },
    {
        callbacks: {
            authorized: (params) => {
                let { token } = params;
                return !!token;
            },
        },
    }
);

export const config = { matcher: ['/admin/:path*', '/employee/:path*', '/booking/:path*', '/support/:path*'] };