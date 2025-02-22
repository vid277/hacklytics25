import { forgotPasswordAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ForgotPassword({
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

  return (
    <form className="flex-1 flex flex-col min-w-64 items-center justify-center w-screen h-screen">
      <div className="flex flex-col gap-2 items-center w-[30rem]">
        <h1 className="text-4xl font-medium font-oddlini">Reset Password</h1>
        <p className="text-sm text-foreground font-hanken items-center">
          Remember your password?{" "}
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
          <SubmitButton
            formAction={forgotPasswordAction}
            pendingText="Sending reset email..."
            className="font-hanken"
          >
            Send Reset Email
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </div>
    </form>
  );
}
