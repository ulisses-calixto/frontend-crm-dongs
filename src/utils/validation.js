/**
 * Utilitários de validação para o sistema D'ONGs
 * Validações brasileiras e de negócio
 */

/**
 * Valida CPF brasileiro
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateCPF(cpf) {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  // Calcula primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

/**
 * Valida CNPJ brasileiro
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateCNPJ(cnpj) {
  if (!cnpj) return false;

  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

  // Calcula primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;
  if (remainder !== parseInt(cleanCNPJ.charAt(12))) return false;

  // Calcula segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;
  if (remainder !== parseInt(cleanCNPJ.charAt(13))) return false;

  return true;
}

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateEmail(email) {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} - Verdadeiro se válido
 */
export function validatePhone(phone) {
  if (!phone) return false;

  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');

  // Aceita telefones com 10 ou 11 dígitos (com DDD)
  return cleanPhone.length === 10 || cleanPhone.length === 11;
}

/**
 * Formata CPF
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} - CPF formatado
 */
export function formatCPF(cpf) {
  if (!cpf) return '';
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return cleanCPF;
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ
 * @param {string} cnpj - CNPJ a ser formatado
 * @returns {string} - CNPJ formatado
 */
export function formatCNPJ(cnpj) {
  if (!cnpj) return '';
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14) return cleanCNPJ;
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata telefone brasileiro
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} - Telefone formatado
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return cleanPhone;
}

/**
 * Valida se valor é positivo
 * @param {number} value - Valor a ser validado
 * @returns {boolean} - Verdadeiro se positivo
 */
export function validatePositiveNumber(value) {
  if (value === null || value === undefined || value === '') return true;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

/**
 * Valida se data é válida e não futura
 * @param {string} dateString - Data a ser validada
 * @param {boolean} allowFuture - Permite datas futuras (padrão: false)
 * @returns {boolean} - Verdadeiro se válida
 */
export function validateDate(dateString, allowFuture = false) {
  if (!dateString) return false;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  if (!allowFuture) {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fim do dia atual
    if (date > today) return false;
  }

  return true;
}

/**
 * Valida se data de nascimento é válida (idade entre 0 e 150 anos)
 * @param {string} birthDateString - Data de nascimento
 * @returns {boolean} - Verdadeiro se válida
 */
export function validateBirthDate(birthDateString) {
  if (!birthDateString) return false;

  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return false;

  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 && age <= 150;
}

/**
 * Valida tamanho da família
 * @param {number} familySize - Tamanho da família
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateFamilySize(familySize) {
  if (familySize === null || familySize === undefined) return true;
  const size = parseInt(familySize);
  return !isNaN(size) && size >= 1 && size <= 20;
}

/**
 * Valida renda mensal
 * @param {number} income - Renda mensal
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateMonthlyIncome(income) {
  if (income === null || income === undefined || income === '') return true;
  const num = parseFloat(income);
  return !isNaN(num) && num >= 0 && num <= 100000; // Máximo R$ 100.000
}

/**
 * Valida valor monetário
 * @param {number} value - Valor a ser validado
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateMonetaryValue(value) {
  if (value === null || value === undefined || value === '') return true;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 && num <= 10000000; // Máximo R$ 10 milhões
}

/**
 * Valida quantidade
 * @param {number} quantity - Quantidade a ser validada
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateQuantity(quantity) {
  if (quantity === null || quantity === undefined) return false;
  const num = parseInt(quantity);
  return !isNaN(num) && num >= 1 && num <= 1000000; // Máximo 1 milhão
}

/**
 * Valida se string não está vazia após trim
 * @param {string} str - String a ser validada
 * @returns {boolean} - Verdadeiro se não vazia
 */
export function validateRequired(str) {
  return str && str.trim().length > 0;
}

/**
 * Valida comprimento mínimo de string
 * @param {string} str - String a ser validada
 * @param {number} minLength - Comprimento mínimo
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateMinLength(str, minLength) {
  return str && str.trim().length >= minLength;
}

/**
 * Valida comprimento máximo de string
 * @param {string} str - String a ser validada
 * @param {number} maxLength - Comprimento máximo
 * @returns {boolean} - Verdadeiro se válido
 */
export function validateMaxLength(str, maxLength) {
  return !str || str.length <= maxLength;
}
