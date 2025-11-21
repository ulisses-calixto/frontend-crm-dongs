import { supabase } from "../lib/supabase";

export async function createDistribution(distributionData) {
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
    ...distributionData,
    organization_id: profile.organization_id,
  };

  const { data, error } = await supabase
    .from("distributions")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDistributions(filters = {}) {
  const { data, error } = await supabase
    .from("distributions")
    .select("*, donations(*), beneficiaries(*)")
    .order("distribution_date", { ascending: false });

  if (error) throw error;
  return data;
}
