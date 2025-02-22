import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/magic/navbar";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/hooks/use-toast";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>
            <main className="min-h-screen flex flex-col">
              <Navbar user={session?.user ?? null} />
              {children}
            </main>
          </AuthProvider>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
