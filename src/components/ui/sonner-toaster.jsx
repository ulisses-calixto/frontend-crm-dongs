"use client";
import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: "12px",
          background: "white",
          color: "#0f172a",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        },
      }}
    />
  );
}
