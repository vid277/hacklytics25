import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CookieOptions } from "@supabase/ssr";

export const createClient = async () => {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, {
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          } catch {
            // Ignore errors when cookies cannot be set
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete(name, {
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

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    console.error('Error getting user:', error.message);
  }

  return client;
};
