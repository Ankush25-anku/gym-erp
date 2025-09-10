// src/middleware.js
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // protect all routes except static files
    "/",
    "/api/clerkusers/:path*",
    "/member/:path*", // ✅ Protect member routes
    "/admin", // ✅ Protect /admin
    "/admin/", // ✅ Protect /admin/
    "/admin/:path*", // ✅ Protect /admin/dashboard or any nested route
  ],
};
