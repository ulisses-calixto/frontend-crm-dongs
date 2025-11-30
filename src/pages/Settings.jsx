import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import OrganizationForm from "../components/settings/OrganizationForm";

export default function Settings() {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    setLoading(true);
    try {
      // Busca o usuário logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        toast.error("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      // Busca o profile para obter o organization_id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile?.organization_id) {
        toast.info("Usuário não está vinculado a nenhuma organização.");
        setOrganization(null);
        setLoading(false);
        return;
      }

      // Busca a organização vinculada
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", profile.organization_id)
        .single();

      if (orgError) throw orgError;

      setOrganization(org);
    } catch (error) {
      console.error("Erro ao carregar organização:", error);
      toast.error("Não foi possível carregar os dados da organização.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (orgData) => {
    if (!organization) return;
    try {
      const { error } = await supabase
        .from("organizations")
        .update(orgData)
        .eq("id", organization.id);

      if (error) throw error;

      toast.success("Organização atualizada com sucesso!");
      loadOrganization(); // Atualiza dados após salvar
    } catch (error) {
      console.error("Erro ao atualizar organização:", error);
      toast.error("Erro ao atualizar a organização. Tente novamente.");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto space-y-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Configurações da Organização
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as informações e a identidade da sua ONG
          </p>
        </div>

        <Card className="border bg-white rounded-md">
          <CardHeader className="px-6 pb-2">
            <CardTitle className="text-md font-bold text-foreground">
              INFORMAÇÕES DA ONG.
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando...</p>
              </div>
            ) : organization ? (
              <OrganizationForm
                organization={organization}
                onSave={handleUpdate}
              />
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhuma organização encontrada. Complete a configuração inicial.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
