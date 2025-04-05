import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Configuration
const MAX_REQUESTS_PER_HOUR = 5; // Adjust as needed
const COOKIE_NAME = "rate_limit_data";
const ENABLED = process.env.RATE_LIMIT_ENABLED === "true";
const DEBUG_MODE = true; // Set to false in production

export async function middleware(request: NextRequest) {
  if (!ENABLED) {
    return NextResponse.next(); // Skip rate limiting if disabled
  }

  // Get current timestamp
  const now = Date.now();

  // Get rate limit data from cookie
  const rateLimitCookie = request.cookies.get(COOKIE_NAME);
  let rateLimitData: { count: number; timestamp: number } | null = null;

  if (rateLimitCookie?.value) {
    try {
      rateLimitData = JSON.parse(decodeURIComponent(rateLimitCookie.value));
    } catch (e) {
      // Invalid cookie format, will create new one
    }
  }

  // Check if data exists and is within current hour window
  if (!rateLimitData || now - rateLimitData.timestamp > 3600000) {
    // First request in the window or hour window expired
    rateLimitData = { count: 1, timestamp: now };

    // Create response and set cookie
    const response = NextResponse.next();
    response.cookies.set({
      name: COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(rateLimitData)),
      path: "/",
      maxAge: 3600, // 1 hour
      httpOnly: !DEBUG_MODE, // Set to false in debug mode to make cookie visible
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Add debug header in debug mode
    if (DEBUG_MODE) {
      response.headers.set(
        "X-Rate-Limit-Debug",
        `Requests: 1, Reset: ${new Date(now + 3600000).toISOString()}`
      );
    }

    return response;
  } else {
    // Existing request in the current hour window
    rateLimitData.count++;

    if (rateLimitData.count > MAX_REQUESTS_PER_HOUR) {
      const timeRemaining = Math.ceil(
        (rateLimitData.timestamp + 3600000 - now) / 1000
      );

      // Rate limit exceeded
      return new NextResponse(
        JSON.stringify({ message: "Rate limit exceeded. Try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": timeRemaining.toString(),
          },
        }
      );
    }

    // Update cookie with new count and continue
    const response = NextResponse.next();
    response.cookies.set({
      name: COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(rateLimitData)),
      path: "/",
      maxAge: 3600, // 1 hour
      httpOnly: !DEBUG_MODE, // Set to false in debug mode to make cookie visible
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Add debug header in debug mode
    if (DEBUG_MODE) {
      response.headers.set(
        "X-Rate-Limit-Debug",
        `Requests: ${
          rateLimitData.count
        }, Max: ${MAX_REQUESTS_PER_HOUR}, Reset: ${new Date(
          rateLimitData.timestamp + 3600000
        ).toISOString()}`
      );
    }

    return response;
  }
}

// Apply the middleware to specific routes
export const config = {
  matcher: ["/api/analyze"], // Only apply to the /api/analyze route
};
