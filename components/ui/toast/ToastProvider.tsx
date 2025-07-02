import React from "react";
import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "my-toast",
        style: {
          background: "var(--toast-bg, #ffffff)",
          color: "var(--toast-text, #333333)",
          border: "1px solid var(--toast-border, #e2e8f0)",
        },
      }}
    />
  );
};
