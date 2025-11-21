import { supabase } from "../lib/supabase";

/* ==========================================================
   LOGIN
   ========================================================== */
export async function loginService(email, password) {
  // Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("Falha ao obter usuário autenticado.");

  // Buscar perfil do usuário
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) throw profileError;

  return {
    token: data.session?.access_token ?? null,
    user: {
      id: data.user.id,
      email: data.user.email,
      ...profile,
    },
  };
}

/* ==========================================================
   REGISTRO (Onboarding)
   ========================================================== */
export async function registerOnboarding(userData) {
  // Criar usuário
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.adminName,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Usuário não foi criado corretamente.");

  // Aguardar um pouco para o trigger criar o perfil (se existir)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Buscar perfil criado pelo trigger
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (profileError) {
    // Se não encontrou, tentar criar manualmente
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        name: userData.adminName,
        organization_id: null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      token: authData.session?.access_token ?? null,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        ...newProfile,
      },
    };
  }

  return {
    token: authData.session?.access_token ?? null,
    user: {
      id: authData.user.id,
      email: authData.user.email,
      ...profile,
    },
  };
}

/* ==========================================================
   LOGOUT
   ========================================================== */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}
