/**
 * Utilitários de formatação para o sistema D'ONGs
 * Formatação brasileira e de dados
 */

import { formatCPF, formatCNPJ, formatPhone } from './validation.js';

/**
 * Formata valor monetário brasileiro
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado
 */
export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata número com separadores brasileiros
 * @param {number} value - Número a ser formatado
 * @param {number} decimals - Número de casas decimais
 * @returns {string} - Número formatado
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) return '0';

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formata porcentagem
 * @param {number} value - Valor a ser formatado (0-1)
 * @param {number} decimals - Número de casas decimais
 * @returns {string} - Porcentagem formatada
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '0%';

  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formata data brasileira
 * @param {string|Date} date - Data a ser formatada
 * @param {string} format - Formato desejado ('short', 'long', 'full')
 * @returns {string} - Data formatada
 */
export function formatDate(date, format = 'short') {
  if (!date) return 'Data não informada';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Data inválida';

  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' },
    full: {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  };

  return new Intl.DateTimeFormat('pt-BR', options[format]).format(dateObj);
}

/**
 * Formata data e hora brasileira
 * @param {string|Date} date - Data/hora a ser formatada
 * @returns {string} - Data e hora formatadas
 */
export function formatDateTime(date) {
  if (!date) return 'Data não informada';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Data inválida';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Formata CPF/CNPJ automaticamente
 * @param {string} document - Documento a ser formatado
 * @returns {string} - Documento formatado
 */
export function formatDocument(document) {
  if (!document) return '';

  const clean = document.replace(/\D/g, '');

  if (clean.length === 11) {
    return formatCPF(clean);
  } else if (clean.length === 14) {
    return formatCNPJ(clean);
  }

  return document;
}

/**
 * Formata telefone automaticamente
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} - Telefone formatado
 */
export function formatPhoneAuto(phone) {
  return formatPhone(phone);
}

/**
 * Capitaliza primeira letra de cada palavra
 * @param {string} str - String a ser capitalizada
 * @returns {string} - String capitalizada
 */
export function capitalize(str) {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Trunca texto com reticências
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} - Texto truncado
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Formata prioridade do beneficiado
 * @param {string} priority - Prioridade
 * @returns {string} - Prioridade formatada
 */
export function formatPriority(priority) {
  const priorities = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta'
  };

  return priorities[priority] || priority;
}

/**
 * Formata status do beneficiado
 * @param {string} status - Status
 * @returns {string} - Status formatado
 */
export function formatBeneficiaryStatus(status) {
  const statuses = {
    active: 'Ativo',
    inactive: 'Inativo',
    completed: 'Concluído'
  };

  return statuses[status] || status;
}

/**
 * Formata tipo de doação
 * @param {string} type - Tipo de doação
 * @returns {string} - Tipo formatado
 */
export function formatDonationType(type) {
  const types = {
    monetary: 'Monetária',
    food: 'Alimentos',
    clothing: 'Roupas',
    toys: 'Brinquedos',
    books: 'Livros',
    electronics: 'Eletrônicos',
    medicine: 'Medicamentos',
    other: 'Outros'
  };

  return types[type] || type;
}

/**
 * Formata status da doação
 * @param {string} status - Status da doação
 * @returns {string} - Status formatado
 */
export function formatDonationStatus(status) {
  const statuses = {
    received: 'Recebida',
    partially_distributed: 'Parcialmente Distribuída',
    fully_distributed: 'Totalmente Distribuída',
    pending: 'Pendente'
  };

  return statuses[status] || status;
}

/**
 * Formata unidade de medida
 * @param {string} unit - Unidade
 * @param {number} quantity - Quantidade
 * @returns {string} - Unidade formatada
 */
export function formatUnit(unit, quantity = 1) {
  if (!unit) return '';

  // Pluralizar automaticamente
  const isPlural = quantity > 1;
  const unitLower = unit.toLowerCase();

  // Regras especiais de pluralização
  if (unitLower === 'kg' || unitLower === 'kg') return unit;
  if (unitLower === 'unidade' || unitLower === 'unidades') {
    return isPlural ? 'unidades' : 'unidade';
  }
  if (unitLower === 'litro' || unitLower === 'litros') {
    return isPlural ? 'litros' : 'litro';
  }
  if (unitLower === 'caixa' || unitLower === 'caixas') {
    return isPlural ? 'caixas' : 'caixa';
  }

  return unit;
}

/**
 * Formata quantidade com unidade
 * @param {number} quantity - Quantidade
 * @param {string} unit - Unidade
 * @returns {string} - Quantidade formatada
 */
export function formatQuantity(quantity, unit) {
  if (quantity === null || quantity === undefined) return '';

  const formattedQuantity = formatNumber(quantity);
  const formattedUnit = formatUnit(unit, quantity);

  return formattedUnit ? `${formattedQuantity} ${formattedUnit}` : formattedQuantity;
}
