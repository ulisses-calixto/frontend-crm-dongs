import { supabase } from "../lib/supabase";

const apiClient = {
  //
  // ---------- MÉTODOS GENÉRICOS ----------
  //

  async get(table, options = {}) {
    let query = supabase.from(table).select(options.select || "*");

    // filtros: { id: 1, status: "active" }
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // ordenação: { column: "created_at", ascending: false }
    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending ?? true,
      });
    }

    // pegar apenas 1 registro
    if (options.single) {
      query = query.single();
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async insert(table, payload) {
    const { data, error } = await supabase.from(table).insert(payload).select();
    if (error) throw error;
    return data;
  },

  async update(table, payload, filters = {}) {
    let query = supabase.from(table).update(payload);

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.select();
    if (error) throw error;
    return data;
  },

  async delete(table, filters = {}) {
    let query = supabase.from(table).delete();

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.select();
    if (error) throw error;
    return data;
  },

  //
  // ---------- AUTH ----------
  //

  auth: {
    async me() {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },

    async updateMe(updateData) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userData.user.id);

      if (error) throw error;
      return true;
    },
  },

  //
  // ---------- ENTITIES (exemplo) ----------
  //

  entities: {
    Organization: {
      async create(data) {
        const { data: org, error } = await supabase
          .from("organizations")
          .insert(data)
          .select()
          .single();

        if (error) throw error;
        return org;
      },
    },
  },
};

export default apiClient;
