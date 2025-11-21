export function getSupabaseErrorMessage(error) {
  if (!error) return "Erro desconhecido.";

  // Supabase Auth API Errors
  if (error.message) return error.message;

  // Alguns erros vêm neste formato:
  if (error.error_description) return error.error_description;

  // Outros vêm como nested object:
  if (error?.error?.message) return error.error.message;

  // Caso o Supabase mudar no futuro:
  try {
    return JSON.stringify(error);
  } catch {
    return "Ocorreu um erro inesperado.";
  }
}
export function getSuccessMessage(msg) {
  return msg || "Operação realizada com sucesso!";
}
