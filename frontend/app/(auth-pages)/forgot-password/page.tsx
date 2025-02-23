import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

type Message = {
  message?: string;
  error?: string;
  success?: string;
};

export default async function ForgotPasswordPage(props: {
  searchParams: Promise<Message>;
}) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <ForgotPasswordForm
        message={searchParams.message || ""}
        error={searchParams.error || ""}
      />
    </div>
  );
}
