import { NextRequest, NextResponse } from "next/server";
import { UTM_COOKIE, utmFromSearchParams, hasUtm } from "@/lib/utm";

/**
 * First-touch UTM capture: when a visitor lands from an ad with utm_* params,
 * persist them in a cookie so lead submissions anywhere on the site carry the
 * original campaign attribution.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.cookies.has(UTM_COOKIE)) return response;
  const utm = utmFromSearchParams(request.nextUrl.searchParams);
  if (!hasUtm(utm)) return response;
  response.cookies.set(UTM_COOKIE, JSON.stringify(utm), {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  // Skip static assets and API routes.
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
