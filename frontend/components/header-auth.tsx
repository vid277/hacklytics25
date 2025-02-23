import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "../utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { UserCircle } from "lucide-react";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <nav className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/jobs">Jobs</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/create">Upload</Link>
        </Button>
      </nav>
      <div className="flex items-center gap-2">
        <UserCircle className="h-6 w-6" />
        <span className="font-hanken text-sm">{user.email}</span>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
