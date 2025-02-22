import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CookieOptions } from "@supabase/ssr";

export const createClient = async () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          try {
            const cookie = await cookieStore.get(name);
            return cookie?.value;
          } catch {
            return undefined;
          }
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            await cookieStore.set(name, value, {
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          } catch {
            // Ignore errors when cookies cannot be set
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            await cookieStore.delete(name, {
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          } catch {
            // Ignore errors when cookies cannot be removed
          }
        },
      },
    }
  );
};
