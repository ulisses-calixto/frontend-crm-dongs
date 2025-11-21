import { supabase } from "../lib/supabase";

export async function getBeneficiaries(
  filters = {},
  order = "-registration_date"
) {
  const { data, error } = await supabase
    .from("beneficiaries")
    .select("*")
    .order("registration_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createBeneficiary(beneficiaryData) {
  // 🔒 Obter organization_id do usuário autenticado
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) throw userError;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    throw new Error("Usuário não está vinculado a nenhuma organização.");
  }

  const payload = {
    ...beneficiaryData,
    organization_id: profile.organization_id,
  };

  const { data, error } = await supabase
    .from("beneficiaries")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBeneficiary(id, updates) {
  // 🔒 Validar valores permitidos para evitar erros de constraint
  const validPriorityLevels = ['high', 'medium', 'low'];
  const validStatuses = ['active', 'inactive', 'completed'];

  const cleanedUpdates = { ...updates };

  // 🔒 Validar priority_level - não permitir valores vazios ou inválidos
  if (cleanedUpdates.priority_level !== undefined) {
    if (!cleanedUpdates.priority_level || !validPriorityLevels.includes(cleanedUpdates.priority_level)) {
      throw new Error(`Nível de prioridade inválido: ${cleanedUpdates.priority_level}. Deve ser 'high', 'medium' ou 'low'.`);
    }
  }

  // 🔒 Validar status - não permitir valores vazios ou inválidos
  if (cleanedUpdates.status !== undefined) {
    if (!cleanedUpdates.status || !validStatuses.includes(cleanedUpdates.status)) {
      throw new Error(`Status de beneficiado inválido: ${cleanedUpdates.status}. Deve ser 'active', 'inactive' ou 'completed'.`);
    }
  }

  const { data, error } = await supabase
    .from("beneficiaries")
    .update(cleanedUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBeneficiary(id) {
  const { error } = await supabase.from("beneficiaries").delete().eq("id", id);

  if (error) throw error;
}