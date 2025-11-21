import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginService } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import AuthLayout from "./AuthLayout";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export default function Login() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });
  const { errors, isSubmitting } = formState;
  const navigate = useNavigate();
  const auth = useAuth();

  async function onSubmit(values) {
    try {
      const { token, user } = await loginService(values.email, values.password);

      if (token) {
        auth.signIn(token, user);
        navigate("/painel-de-controle");
      }

    } catch (err) {
      toast.error("Erro ao efetuar login.", {
        description: "Verifique suas credenciais e tente novamente.",
      });
    }
  }

  return (
    <AuthLayout>
      <Card className="border border-slate-200 shadow-lg rounded-2xl bg-white p-6 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle
            className="text-center text-2xl font-semibold text-slate-800"
          >
            Acessar Conta
          </CardTitle>
          <p className="text-center text-sm text-slate-500">
            Entre com suas credenciais para continuar
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Email</Label>
              <Input
                {...register("email")}
                placeholder="seu@email.com"
                className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-600"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* SENHA */}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Senha</Label>
              <Input
                type="password"
                {...register("password")}
                placeholder="••••••"
                className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-600"
              />
              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BOTÃO */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>

            {/* LINK */}
            <p className="text-center text-sm text-slate-600">
              Não tem uma conta?{" "}
              <Link
                to="/auth/register"
                className="text-sky-700 font-semibold hover:underline"
              >
                Cadastre-se
              </Link>
            </p>

          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
