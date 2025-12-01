import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "@/context/AuthContext"; 
import apiClient from "@/services/apiClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowRight, Building2 } from "lucide-react";

export default function FirstSetup() {
  const navigate = useNavigate();
  const auth = useAuth(); 
  const [loading, setLoading] = useState(false);

  const [orgData, setOrgData] = useState({
    name: "",
    cnpj: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  const handleOrgInputChange = (field, value) => {
    setOrgData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // 1️⃣ Pega dados do usuário logado
      const me = await apiClient.auth.me();

      // 2️⃣ Cria a organização
      const organization = await apiClient.entities.Organization.create({
        ...orgData,
        admin_user_id: me.id,
      });

      // 3️⃣ Atualiza o usuário na API
      await apiClient.auth.updateMe({
        organization_id: organization.id,
        department: "Administrador(a)",
      });

      // 4️⃣ Atualiza no contexto Auth
      auth.updateUser({
        ...me,
        organization_id: organization.id,
        department: "Administrador(a)",
      });

      // 5️⃣ Envia para o painel
      navigate("/painel-de-controle", { replace: true });

    } catch (error) {
      console.error("Erro ao configurar organização:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl w-full">
        <Card className="border border-slate-200 rounded-md bg-white">
          <CardHeader>
            <div className="w-full mx-auto mb-2">
              <div className=" flex items-center justify-center px-4">
                <CardTitle className="text-lg sm:text-2xl font-bold flex items-center justify-center gap-3 text-center">
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                  Cadastro da Organização
                </CardTitle>
              </div>

              <p className="text-center text-slate-600 mt-3 px-2 text-sm sm:text-base">
                Preencha os campos obrigatórios para finalizar sua configuração inicial.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Nome e CNPJ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">
                  Nome da Organização *
                </Label>
                <Input
                  placeholder="Ex: Instituto Esperança"
                  value={orgData.name}
                  onChange={(e) => handleOrgInputChange("name", e.target.value)}
                  className="h-11 sm:h-12 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">CNPJ *</Label>
                <Input
                  placeholder="00.000.000/0001-00"
                  value={orgData.cnpj}
                  onChange={(e) => handleOrgInputChange("cnpj", e.target.value)}
                  className="h-11 sm:h-12 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
                  required
                />
              </div>
            </div>

            {/*Descrição*/}
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">
                Descrição da Missão *
              </Label>
              <Textarea
                placeholder="Descreva brevemente a missão e os objetivos da organização"
                value={orgData.description}
                onChange={(e) =>
                  handleOrgInputChange("description", e.target.value)
                }
                className="h-28 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
                required
              />
            </div>

            {/*Endereço*/}
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">
                Endereço Completo
              </Label>
              <Input
                placeholder="Rua, número, bairro, cidade, estado, CEP"
                value={orgData.address}
                onChange={(e) =>
                  handleOrgInputChange("address", e.target.value)
                }
                className="h-11 sm:h-12 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
              />
            </div>

            {/*Telefone e e-mail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">Telefone</Label>
                <Input
                  placeholder="(88) 99999-9999"
                  value={orgData.phone}
                  onChange={(e) =>
                    handleOrgInputChange("phone", e.target.value)
                  }
                  className="h-11 sm:h-12 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">
                  Email Institucional
                </Label>
                <Input
                  type="email"
                  placeholder="contato@organizacao.org"
                  value={orgData.email}
                  onChange={(e) =>
                    handleOrgInputChange("email", e.target.value)
                  }
                  className="h-11 sm:h-12 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
                />
              </div>
            </div>

            {/*Website*/}
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">Website</Label>
              <Input
                placeholder="https://www.siteorganizacao.org"
                value={orgData.website}
                onChange={(e) =>
                  handleOrgInputChange("website", e.target.value)
                }
                className="h-11 sm:h-12 rounded-md border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700"
              />
            </div>

            {/*Botão*/}
            
            <Button
              onClick={handleComplete}
              disabled={
                loading ||
                !orgData.name ||
                !orgData.cnpj ||
                !orgData.description
              }
              className="w-full h-11 sm:h-12 rounded-md text-base sm:text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  Aguarde...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Concluir
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center mt-4 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto px-4">
          Ao continuar, você concorda em utilizar o Sistema D'ONGs para gerenciar sua organização
          com responsabilidade e transparência.
        </p>
      </div>
    </div>
  );
}
