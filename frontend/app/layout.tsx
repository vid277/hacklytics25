import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/hooks/use-toast";
import "./globals.css";
import Navbar from "@/components/magic/navbar";
import { createClient } from "@/utils/supabase/server";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider>
            <main className="min-h-screen flex flex-col">
              {" "}
              <Navbar user={user ?? null} />
              {children}
            </main>
          </AuthProvider>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
