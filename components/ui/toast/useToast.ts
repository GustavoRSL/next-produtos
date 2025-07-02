import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  duration?: number;
  id?: string;
}

/**
 * Hook para exibir notificações toast de diferentes tipos
 */
export const useToast = () => {
  const showToast = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions,
  ) => {
    const defaultOptions = {
      duration: 5000,
      ...options,
    };

    switch (type) {
      case "success":
        toast.success(message, defaultOptions);
        break;
      case "error":
        toast.error(message, defaultOptions);
        break;
      case "warning":
        toast.warning(message, defaultOptions);
        break;
      case "info":
      default:
        toast.info(message, defaultOptions);
        break;
    }
  };

  return {
    success: (message: string, options?: ToastOptions) =>
      showToast(message, "success", options),
    error: (message: string, options?: ToastOptions) =>
      showToast(message, "error", options),
    warning: (message: string, options?: ToastOptions) =>
      showToast(message, "warning", options),
    info: (message: string, options?: ToastOptions) =>
      showToast(message, "info", options),
    showToast,
  };
};
