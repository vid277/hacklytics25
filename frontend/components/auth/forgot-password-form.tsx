"use client";

import { forgotPasswordAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ForgotPasswordFormProps {
  message?: string;
  error?: string;
}

export function ForgotPasswordForm({ message, error }: ForgotPasswordFormProps) {
  return (
    <form className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-4xl font-medium font-oddlini">Forgot Password</h1>
      <p className="text-sm text-foreground font-hanken items-center">
        Enter your email to receive a password reset link.{" "}
        <Link
          className="text-foreground font-medium underline font-hanken"
          href="/sign-in"
        >
          Back to Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4 w-full">
        <Label htmlFor="email" className="font-hanken">
          Email
        </Label>
        <Input name="email" placeholder="you@example.com" required />
        <SubmitButton
          pendingText="Sending Reset Link..."
          formAction={forgotPasswordAction}
          className="font-hanken"
        >
          Send Reset Link
        </SubmitButton>
        <FormMessage
          message={{
            message: message || "",
            error: error || "",
            success: "",
          }}
        />
      </div>
    </form>
  );
} 