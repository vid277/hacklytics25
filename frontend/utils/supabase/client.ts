import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${name}=`))
          ?.split("=")[1];
      },
      set(
        name: string,
        value: string,
        options: { maxAge?: number; path?: string },
      ) {
        let cookie = `${name}=${value}`;
        if (options.maxAge) {
          cookie += `; Max-Age=${options.maxAge}`;
        }
        if (options.path) {
          cookie += `; Path=${options.path}`;
        }
        document.cookie = cookie;
      },
      remove(name: string, options: { path?: string }) {
        document.cookie = `${name}=; Max-Age=0${options.path ? `; Path=${options.path}` : ""}`;
      },
    },
  },
);
