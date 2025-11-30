import { HeartHandshake } from "lucide-react";
import React from "react";
import { Toaster } from "sonner";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4">
      <Toaster
        position="bottom-right"
        richColors
      />

      <div className="flex flex-row items-center align-center justify-center text-center mb-4 gap-2">
        <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center">
          <HeartHandshake className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">D'ONGs</h1>
      </div>

      {/*conteúdo*/}
      <div className="w-full max-w-sm">
        {children}
      </div>

        <p className="text-center mt-4 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto px-4">
          Gerencie sua organização de forma rápida e transparente.
        </p>
    </div>
  );
}
