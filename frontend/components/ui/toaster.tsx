"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as ToastPrimitive,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastPrimitive>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastPrimitive>
  );
}
