import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/magic/navbar";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex flex-col">
          <Navbar user={user} />
          {children}
        </main>
      </body>
    </html>
  );
}
