import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log("Middleware triggered for path:", req.nextUrl.pathname);
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Return an array of { name, value }
        getAll: async () => {
          const allCookies = req.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
          }));
          return allCookies;
        },
        // Accept an array of { name, value, options }
        setAll: async (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Session exists:", !!session);
  if (session) {
    console.log("Session user:", session.user.email);
  }

  const path = req.nextUrl.pathname;

  // Protect /residences
  if (path.startsWith('/residences')) {
    console.log("Residences path detected");
    if (!session) {
      console.log("No session, redirecting to login");
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', path);
      return NextResponse.redirect(redirectUrl);
    }
    console.log("Session found, access granted to residences");
    return res;
  }

  // Redirect logged-in user away from /login
  if (path === '/login') {
    console.log("Login path detected");
    if (session) {
      console.log("Already logged in, redirecting to home");
      return NextResponse.redirect(new URL('/', req.url));
    }
    console.log("No session, allow access to login");
    return res;
  }

  // All other routes
  console.log("Default: proceeding");
  return res;
}

// Middleware route matcher
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
