import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "rate_limit_data";
const MAX_REQUESTS_PER_HOUR = 5; // Match the value in middleware.ts

export async function GET() {
  const cookieStore = await cookies();
  const rateLimitCookie = cookieStore.get(COOKIE_NAME);

  let remaining = MAX_REQUESTS_PER_HOUR;
  let resetsIn = null;

  if (rateLimitCookie?.value) {
    try {
      const rateLimitData = JSON.parse(
        decodeURIComponent(rateLimitCookie.value)
      );
      const now = Date.now();
      const expireTime = rateLimitData.timestamp + 3600000; // 1 hour in ms

      if (now < expireTime) {
        remaining = Math.max(0, MAX_REQUESTS_PER_HOUR - rateLimitData.count);
        resetsIn = Math.ceil((expireTime - now) / 1000); // seconds until reset
      }
    } catch (e) {
      // Invalid cookie format
    }
  }

  return NextResponse.json({
    limit: MAX_REQUESTS_PER_HOUR,
    remaining: remaining,
    resetsIn: resetsIn,
  });
}
