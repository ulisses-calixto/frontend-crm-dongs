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
          description: "Bem-vindo(a)! Você já pode acessar o painel.",
        });
        navigate("/painel-de-controle");
      }
    } catch (err) {
      const message =
        err?.message ||
        err?.error_description ||
        err?.error?.message ||
        "Ocorreu um erro ao criar a conta. Tente novamente.";

      toast.error("Erro ao criar conta.", { description: message });
    }
  }

  return (
    <AuthLayout>
      <Card className="border border-slate-200 shadow-xl rounded-2xl bg-white p-6">
        <CardHeader className="mb-1">
          <CardTitle className="text-center text-2xl font-semibold text-slate-800">
            Criar Conta
          </CardTitle>
          <p className="text-center text-sm text-slate-500 mt-2">
            Crie sua conta administrativa para começar a usar o sistema
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* NOME */}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Nome completo</Label>
              <Input
                {...register("adminName")}
                placeholder="Nome do administrador"
                className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-600"
                autoComplete="name"
              />
              {errors.adminName && (
                <p className="text-xs text-red-600">{errors.adminName.message}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Email</Label>
              <Input
                {...register("adminEmail")}
                placeholder="seu@email.com"
                className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-600"
                autoComplete="email"
              />
              {errors.adminEmail && (
                <p className="text-xs text-red-600">{errors.adminEmail.message}</p>
              )}
            </div>

            {/* SENHA */}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Senha</Label>
              <Input
                type="password"
                {...register("adminPassword")}
                placeholder="••••••"
                className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-600"
                autoComplete="new-password"
              />
              {errors.adminPassword && (
                <p className="text-xs text-red-600">{errors.adminPassword.message}</p>
              )}
            </div>

            {/* BOTÃO */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>

            {/* LINKS */}
            <div className="text-center text-sm text-slate-600">
              <p>
                Já possui conta?{" "}
                <Link to="/auth/login" className="text-sky-700 font-semibold hover:underline">
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
