import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE } from "./app/lib/constants";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
