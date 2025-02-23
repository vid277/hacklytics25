import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          await cookieStore.set({
            name,
            value,
            ...options,
            // Make sure the cookie works in all contexts
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        },
        async remove(name: string, options: CookieOptions) {
          await cookieStore.delete({
            name,
            ...options,
            // Make sure the cookie is removed in all contexts
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        },
      },
    },
  );
};

export async function getSession() {
  const supabase = await createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    return null;
  }
}
