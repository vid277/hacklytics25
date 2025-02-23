import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            if (process.env.NODE_ENV !== "production") {
              console.error("Error setting cookie:", error);
            }
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete(name);
          } catch (error) {
            if (process.env.NODE_ENV !== "production") {
              console.error("Error removing cookie:", error);
            }
          }
        },
      },
    },
  );
};

export async function getSession() {
  const supabase = createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    return null;
  }
}
