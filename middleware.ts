import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth0 } from "./lib/auth0";
import { roleFromAuth0Identity } from "./lib/auth-role";

export async function middleware(request: NextRequest) {
  try {
    if (request.nextUrl.pathname === "/account") {
      const session = await auth0.getSession(request);

      if (!session?.user) {
        const loginUrl = new URL("/login", request.url);

        loginUrl.searchParams.set("returnTo", "/account");

        return NextResponse.redirect(loginUrl);
      }

      const role = roleFromAuth0Identity(session.user);

      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/portal", request.url),
      );
    }

    return await auth0.middleware(request);
  } catch (error) {
    console.error("[auth0-middleware]", {
      pathname: request.nextUrl.pathname,

      name: error instanceof Error ? error.name : "UnknownError",

      message: error instanceof Error ? error.message : String(error),

      stack: error instanceof Error ? error.stack : undefined,

      cause:
        error instanceof Error && "cause" in error ? error.cause : undefined,
    });

    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("authError", "1");

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/auth/:path*", "/account"],
};
