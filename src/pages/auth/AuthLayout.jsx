import { HeartHandshake } from "lucide-react";
import React from "react";
import { Toaster } from "sonner";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">

      {/* Toaster global para telas de autenticação */}
      <Toaster
        position="bottom-right"
        richColors
      />

      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-700 to-sky-700 rounded-3xl flex items-center justify-center shadow-xl">
          <HeartHandshake className="w-12 h-12 text-white" />
        </div>

      <h1 className="text-3xl font-bold mt-4 text-gray-900">D'ONGs</h1>
        <p className="text-gray-700 mt-1 max-w-xs">
          Gerencie sua organização de forma rápida e transparente.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        {children}
      </div>

    </div>
  );
}
