import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerOnboarding } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import AuthLayout from "./AuthLayout";
import { ArrowRight } from "lucide-react";

const schema = z.object({
  adminName: z.string().min(2, "Nome do administrador é obrigatório"),
  adminEmail: z.string().email("Email inválido"),
  adminPassword: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export default function Register() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });
  const { errors, isSubmitting } = formState;

  const navigate = useNavigate();
  const auth = useAuth();

  async function onSubmit(values) {
    try {
      const { token, user } = await registerOnboarding({
        adminName: values.adminName,
        email: values.adminEmail,
        password: values.adminPassword,
      });

      if (token) {
        auth.signIn(token, user);
        toast.success("Conta criada com sucesso!", {
          description: "Agora vamos criar sua organização.",
        });

        navigate("/cadastro-da-organizacao", { replace: true });
      }

    } catch (err) {
      const message =
        err?.message ||
        err?.error_description ||
        err?.error?.message ||
        "Ocorreu um erro ao criar a conta. Tente novamente.";

      toast.error("Erro ao criar conta.", { 
        description: "Usuário já cadastrado." || message,
      });
    }
  }

  return (
    <AuthLayout>
      <Card className="border border-slate-200 rounded-md bg-white p-4">
        <CardHeader className="mb-1">
          <CardTitle className="text-center text-2xl font-semibold text-slate-800">
            Criar conta
          </CardTitle>
          <p className="text-center text-sm text-slate-600">
            Crie sua conta administrativa para começar
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/*Nome*/}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Nome completo</Label>
              <Input
                {...register("adminName")}
                placeholder="Nome do administrador"
                className="h-11 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
                autoComplete="name"
              />
              {errors.adminName && (
                <p className="text-xs text-red-600">{errors.adminName.message}</p>
              )}
            </div>

            {/*Email*/}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Email</Label>
              <Input
                {...register("adminEmail")}
                placeholder="seu@email.com"
                className="h-11 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
                autoComplete="email"
              />
              {errors.adminEmail && (
                <p className="text-xs text-red-600">{errors.adminEmail.message}</p>
              )}
            </div>

            {/*Senha */}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Senha</Label>
              <Input
                type="password"
                {...register("adminPassword")}
                placeholder="••••••"
                className="h-11 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
                autoComplete="new-password"
              />
              {errors.adminPassword && (
                <p className="text-xs text-red-600">{errors.adminPassword.message}</p>
              )}
            </div>

            {/*Botão*/}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-700 hover:bg-blue-500 rounded-md text-base font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criar
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Criar
                </div>
              )}
            </Button>

            {/*Link de redirecionamento login */}
            <div className="text-center text-sm text-slate-600">
              <p>
                Já possui conta?{" "}
                <Link to="/auth/login" className="text-slate-900 font-semibold hover:underline">
                  Fazer login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
