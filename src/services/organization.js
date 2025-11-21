import { supabase } from "../lib/supabase";

export async function getOrganization(id) {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createOrganization(orgData) {
  const { data, error } = await supabase
    .from("organizations")
    .insert(orgData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrganization(id, updates) {
  const { data, error } = await supabase
    .from("organizations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}