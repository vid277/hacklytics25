import { Metadata } from "next";
import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

type MessageData = {
  message: string;
  error: string;
  success: string;
};

type SearchParams = {
  message?: string;
  error?: string;
  success?: string;
};

export default async function SignInPage({
  searchParams = {},
}: {
  searchParams?: Partial<SearchParams>;
}) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user && !error) {
    return redirect("/dashboard");
  }

  const messageData: MessageData = {
    message: searchParams.message || "",
    error: searchParams.error || "",
    success: searchParams.success || "",
  };

  return (
    <div className="flex-1 flex flex-col min-w-64 items-center justify-center w-screen h-[calc(100vh-10rem)]">
      <form className="flex flex-col gap-2 items-center w-[30rem]">
        <h1 className="text-4xl font-medium font-oddlini">Sign in</h1>
        <p className="text-sm text-foreground font-hanken items-center">
          Don't have an account?{" "}
          <Link
            className="text-foreground font-medium underline font-hanken"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4 w-full">
          <Label htmlFor="email" className="font-hanken">
            Email
          </Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="font-hanken">
              Password
            </Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton
            pendingText="Signing In..."
            formAction={signInAction}
            className="font-hanken"
          >
            Sign in
          </SubmitButton>
          <FormMessage message={messageData} />
        </div>
      </form>
    </div>
  );
}
