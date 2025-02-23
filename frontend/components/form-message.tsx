"use client";

import { useEffect, useState } from "react";

export interface Message {
  message: string;
  error: string;
  success: string;
}

interface FormMessageProps {
  message: Message;
}

export function FormMessage({ message }: FormMessageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!message.error && !message.message && !message.success) return null;

  return (
    <div
      className={`p-3 ${
        message.error
          ? "bg-red-100 border-red-200 text-red-600"
          : message.success
          ? "bg-green-100 border-green-200 text-green-600"
          : "bg-blue-100 border-blue-200 text-blue-600"
      } border rounded-md text-sm font-hanken`}
    >
      {message.error || message.success || message.message}
    </div>
  );
}
