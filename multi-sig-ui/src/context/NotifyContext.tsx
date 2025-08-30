// src/context/NotifyContext.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { ExternalToast, toast } from "sonner";
import {
  CheckCircle2,
  X,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface NotifyOptions {
  description?: ReactNode;
  duration?: number; // ms (use Infinity for persistent)
  action?: { label: string; onClick: () => void };
  position?: ExternalToast["position"]; // 👈 reutilizamos el tipo oficial de sonner
}

interface NotifyContextValue {
  notify: (
    type: ToastType,
    title: ReactNode,
    options?: NotifyOptions
  ) => string | number | undefined;
}

const NotifyContext = createContext<NotifyContextValue | undefined>(undefined);

export function NotifyProvider({ children }: { children: ReactNode }) {
  const notify = (
    type: ToastType,
    title: ReactNode,
    { 
      description, 
      duration = 6000, 
      action, 
      position 
    }: NotifyOptions = {}
  ) => {
    const base =
      "flex items-start gap-3 p-4 rounded-xl shadow-2xl border w-full max-w-md";
    const styles: Record<ToastType, string> = {
      success:
        "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900",
      error: "bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200 text-rose-900",
      warning:
        "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-900",
      info: "bg-gradient-to-r from-sky-50 to-sky-100 border-sky-200 text-sky-900",
      loading: "bg-zinc-900 border-zinc-800 text-white",
    };

    const icons: Record<ToastType, ReactNode> = {
      success: <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5" />,
      error: <XCircle className="w-6 h-6 text-rose-600 mt-0.5" />,
      warning: <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />,
      info: <Info className="w-6 h-6 text-sky-600 mt-0.5" />,
      loading: <Loader2 className="w-6 h-6 animate-spin mt-0.5" />,
    };

    const id = toast.custom(
      (t) => (
        <div className={`${base} ${styles[type]}`}>
          {icons[type]}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm truncate">{title}</div>
                {
                  description && (
                    <div className="mt-1 text-sm opacity-90 truncate">
                      { typeof(description) === 'string' ? description.substring(0, 50) : description }
                    </div>
                  )
                }
              </div>

              <div className="flex items-center gap-2 ml-4">
                {action && (
                  <button
                    onClick={() => {
                      try {
                        action.onClick();
                      } catch (e) {
                        console.error(e);
                      }
                      toast.dismiss(t);
                    }}
                    className="text-sm font-medium px-3 py-1 rounded-md bg-white/10 hover:bg-white/20"
                  >
                    {action.label}
                  </button>
                )}

                <button
                  onClick={() => toast.dismiss(t)}
                  aria-label="Close"
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: duration,
        position: position || "bottom-right",
      }
    );
    return id;
  };

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error("useNotify must be used within a NotifyProvider");
  }
  return context;
}
