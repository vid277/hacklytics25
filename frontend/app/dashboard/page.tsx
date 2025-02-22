import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/sign-in");
  }

  return <DashboardContent />;
}
