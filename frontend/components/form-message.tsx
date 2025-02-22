"use client";

interface Message {
  message?: string;
  error?: string;
  success?: string;
}

export function FormMessage({ message }: { message: Message }) {
  if (!message) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {message.success && (
        <div className="text-foreground border-l-2 border-foreground px-4">
          {message.success}
        </div>
      )}
      {message.error && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4">
          {message.error}
        </div>
      )}
      {message.message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}
    </div>
  );
}
