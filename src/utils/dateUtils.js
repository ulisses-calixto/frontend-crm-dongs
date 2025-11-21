/**
 * Utilitários de data para o sistema D'ONGs
 * Tratamento correto de timezone e formatação
 */

/**
 * Obtém a data atual no formato local brasileiro (YYYY-MM-DD)
 * @returns {string} Data no formato YYYY-MM-DD
 */
export function getCurrentLocalDate() {
  // Cria uma nova data baseada na data local, não UTC
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Converte uma data ISO string para formato local brasileiro
 * @param {string} isoString - Data em formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @returns {string} Data no formato YYYY-MM-DD
 */
export function isoToLocalDateString(isoString) {
  if (!isoString) return '';

  // Se já estiver no formato YYYY-MM-DD, retorna como está
  if (isoString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return isoString;
  }

  const date = new Date(isoString);

  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Converte uma data do banco para formato local brasileiro
 * @param {string|Date} dateValue - Data do banco
 * @returns {string} Data no formato YYYY-MM-DD
 */
export function normalizeDateForInput(dateValue) {
  if (!dateValue) return getCurrentLocalDate();

  // Se for string, tenta converter
  if (typeof dateValue === 'string') {
    return isoToLocalDateString(dateValue);
  }

  // Se for Date, converte para local
  if (dateValue instanceof Date) {
    return isoToLocalDateString(dateValue.toISOString());
  }

  return getCurrentLocalDate();
}

/**
 * Formata data para exibição no frontend (DD/MM/YYYY)
 * @param {string|Date} dateValue - Data a ser formatada
 * @returns {string} Data formatada ou mensagem de erro
 */
export function formatDateForDisplay(dateValue) {
  if (!dateValue) return 'Data não informada';

  let date;

  if (typeof dateValue === 'string') {
    // Se já estiver no formato DD/MM/YYYY, retorna como está
    if (dateValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return dateValue;
    }

    // Se estiver no formato YYYY-MM-DD, fazer parsing manual para evitar problemas de timezone
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateValue.split('-').map(Number);
      date = new Date(year, month - 1, day); // Mês é 0-indexed
    } else {
      date = new Date(dateValue);
    }
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    return 'Data inválida';
  }

  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Valida se uma data é válida e não futura
 * @param {string} dateString - Data em formato YYYY-MM-DD
 * @param {boolean} allowFuture - Se permite datas futuras
 * @returns {boolean} Se a data é válida
 */
export function isValidDate(dateString, allowFuture = false) {
  if (!dateString || !dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return false;
  }

  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) {
    return false;
  }

  if (!allowFuture) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      return false;
    }
  }

  return true;
}
