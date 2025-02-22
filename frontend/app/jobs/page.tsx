import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { JobsContent } from "@/components/jobs-content";

export default async function Jobs() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return redirect("/sign-in");
  }

  return <JobsContent />;
}
