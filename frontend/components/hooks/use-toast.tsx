"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

interface State {
  toasts: ToasterToast[];
}

interface Toast extends Omit<ToasterToast, "id"> {}

interface ToastContext extends State {
  toast: (props: Toast) => void;
  dismiss: (toastId?: string) => void;
}

const ToastContext = React.createContext<ToastContext | undefined>(undefined);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>({ toasts: [] });

  const toast = React.useCallback((props: Toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    setState((state) => ({
      ...state,
      toasts: [{ ...props, id }, ...state.toasts].slice(0, TOAST_LIMIT),
    }));
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    setState((state) => ({
      ...state,
      toasts: state.toasts.filter((toast) => {
        if (toastId === undefined || toast.id === toastId) {
          setTimeout(() => {
            setState((state) => ({
              ...state,
              toasts: state.toasts.filter((t) => t.id !== toast.id),
            }));
          }, TOAST_REMOVE_DELAY);
          return false;
        }
        return true;
      }),
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ ...state, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export { ToastProvider, useToast };
