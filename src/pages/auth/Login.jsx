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
        await auth.signIn(token, user);
        navigate("/painel-de-controle", { replace: true });
      }
    } catch (err) {
      toast.error("Erro ao efetuar login.", {
        description: "Verifique suas credenciais e tente novamente.",
      });
    }
  }

  return (
    <AuthLayout>
      <Card className="border border-slate-200 rounded-md bg-white p-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-semibold text-slate-800">
            Acessar conta
          </CardTitle>
          <p className="text-center text-sm text-slate-600">
            Entre com o email e senha cadastrados
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Email</Label>
              <Input
                {...register("email")}
                placeholder="seu@email.com"
                className="h-11 rounded-mb border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-700">Senha</Label>
              <Input
                type="password"
                {...register("password")}
                placeholder="••••••"
                className="h-11 rounded-mb border-slate-300 focus-visible:ring-1 focus-visible:ring-slate-700"
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Botão */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-700 hover:bg-blue-500 rounded-md text-base font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrar
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Entrar
                </div>
              )}
            </Button>

            {/* Link cadastro */}
            <p className="text-center text-sm text-slate-600">
              Não tem uma conta?{" "}
              <Link
                to="/auth/cadastro"
                className="text-slate-900 font-semibold hover:underline"
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
