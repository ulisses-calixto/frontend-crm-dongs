import { supabase } from "../lib/supabase";

export async function getDonations(filters = {}, order = "-donation_date") {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("donation_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createDonation(donationData) {
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
    ...donationData,
    organization_id: profile.organization_id,
  };

  const { data, error } = await supabase
    .from("donations")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDonation(id, updates) {
  // 🔒 Validar valores permitidos para evitar erros de constraint
  const validDonationTypes = ['monetary', 'food', 'clothing', 'toys', 'books', 'electronics', 'medicine', 'other'];
  const validStatuses = ['received', 'partially_distributed', 'fully_distributed', 'pending'];

  const cleanedUpdates = { ...updates };

  if (cleanedUpdates.donation_type && !validDonationTypes.includes(cleanedUpdates.donation_type)) {
    throw new Error(`Tipo de doação inválido: ${cleanedUpdates.donation_type}`);
  }

  if (cleanedUpdates.status && !validStatuses.includes(cleanedUpdates.status)) {
    throw new Error(`Status de doação inválido: ${cleanedUpdates.status}`);
  }

  const { data, error } = await supabase
    .from("donations")
    .update(cleanedUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDonation(id) {
  const { error } = await supabase.from("donations").delete().eq("id", id);

  if (error) throw error;
}