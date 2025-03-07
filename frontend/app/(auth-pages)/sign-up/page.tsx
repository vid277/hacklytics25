import { signUpAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignUp({
  searchParams,
}: {
  searchParams: { message: string; error?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/protected");
  }

  if (searchParams.message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <form className="flex-1 flex flex-col min-w-64 items-center justify-center w-screen h-[calc(100vh-10rem)]">
      <div className="flex flex-col gap-2 items-center w-[30rem]">
        <h1 className="text-4xl font-medium font-oddlini">Sign up</h1>
        <p className="text-sm text-foreground font-hanken items-center">
          Already have an account?{" "}
          <Link
            className="text-foreground font-medium underline font-hanken"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4 w-full">
          <Label htmlFor="email" className="font-hanken">
            Email
          </Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password" className="font-hanken">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton
            formAction={signUpAction}
            pendingText="Signing up..."
            className="font-hanken"
          >
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </div>
    </form>
  );
}
