/**
 * Utilitários de máscara para inputs do sistema D'ONGs
 * Máscaras brasileiras para campos de formulário
 */

/**
 * Máscara para CPF
 * @param {string} value - Valor a ser mascarado
 * @returns {string} - Valor mascarado
 */
export function cpfMask(value) {
  if (!value) return '';

  const cleanValue = value.replace(/\D/g, '');
  const truncatedValue = cleanValue.slice(0, 11);

  return truncatedValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Máscara para CNPJ
 * @param {string} value - Valor a ser mascarado
 * @returns {string} - Valor mascarado
 */
export function cnpjMask(value) {
  if (!value) return '';

  const cleanValue = value.replace(/\D/g, '');
  const truncatedValue = cleanValue.slice(0, 14);

  return truncatedValue
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * Máscara para telefone brasileiro
 * @param {string} value - Valor a ser mascarado
 * @returns {string} - Valor mascarado
 */
export function phoneMask(value) {
  if (!value) return '';

  const cleanValue = value.replace(/\D/g, '');
  const truncatedValue = cleanValue.slice(0, 11);

  if (truncatedValue.length <= 10) {
    // Telefone fixo: (11) 9999-9999
    return truncatedValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  } else {
    // Celular: (11) 99999-9999
    return truncatedValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  }
}

/**
 * Máscara para CEP
 * @param {string} value - Valor a ser mascarado
 * @returns {string} - Valor mascarado
 */
export function cepMask(value) {
  if (!value) return '';

  const cleanValue = value.replace(/\D/g, '');
  const truncatedValue = cleanValue.slice(0, 8);

  return truncatedValue.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

/**
 * Máscara para moeda brasileira
 * @param {string} value - Valor a ser mascarado
 * @returns {string} - Valor mascarado
 */
export function currencyMask(value) {
  if (!value) return '';

  // Remove tudo exceto números e vírgula/ponto
  const cleanValue = value.replace(/[^\d.,]/g, '');

  // Converte para formato numérico
  let numericValue = cleanValue.replace(',', '.');

  // Limita a 2 casas decimais
  const parts = numericValue.split('.');
  if (parts.length > 1) {
    numericValue = parts[0] + '.' + parts[1].slice(0, 2);
  }

  // Formata como moeda
  const number = parseFloat(numericValue);
  if (isNaN(number)) return '';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

/**
 * Máscara para números inteiros
 * @param {string} value - Valor a ser mascarado
 * @param {number} maxDigits - Máximo de dígitos
 * @returns {string} - Valor mascarado
 */
export function numberMask(value, maxDigits = 10) {
  if (!value) return '';

  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.slice(0, maxDigits);
}

/**
 * Máscara para números decimais
 * @param {string} value - Valor a ser mascarado
 * @param {number} maxDigits - Máximo de dígitos antes da vírgula
 * @param {number} decimalPlaces - Casas decimais
 * @returns {string} - Valor mascarado
 */
export function decimalMask(value, maxDigits = 10, decimalPlaces = 2) {
  if (!value) return '';

  // Remove caracteres inválidos
  const cleanValue = value.replace(/[^\d.,]/g, '');

  // Trata múltiplas vírgulas/pontos
  const parts = cleanValue.split(/[.,]/);
  const integerPart = parts[0].slice(0, maxDigits);
  const decimalPart = parts.length > 1 ? parts[1].slice(0, decimalPlaces) : '';

  if (decimalPart) {
    return `${integerPart},${decimalPart}`;
  }

  return integerPart;
}

/**
 * Remove máscara de valor
 * @param {string|number} maskedValue - Valor mascarado
 * @returns {string} - Valor limpo
 */
export function unmask(maskedValue) {
  if (!maskedValue && maskedValue !== 0) return '';

  // Converte para string se necessário
  const stringValue = typeof maskedValue === 'string' ? maskedValue : maskedValue.toString();

  return stringValue.replace(/\D/g, '');
}

/**
 * Remove máscara de moeda
 * @param {string} maskedCurrency - Moeda mascarada
 * @returns {number} - Valor numérico
 */
export function unmaskCurrency(maskedCurrency) {
  if (!maskedCurrency) return 0;

  // Remove símbolos de moeda e espaços
  const cleanValue = maskedCurrency
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const number = parseFloat(cleanValue);
  return isNaN(number) ? 0 : number;
}

/**
 * Aplica máscara baseada no tipo
 * @param {string} value - Valor a ser mascarado
 * @param {string} type - Tipo de máscara
 * @returns {string} - Valor mascarado
 */
export function applyMask(value, type) {
  switch (type) {
    case 'cpf':
      return cpfMask(value);
    case 'cnpj':
      return cnpjMask(value);
    case 'phone':
      return phoneMask(value);
    case 'cep':
      return cepMask(value);
    case 'currency':
      return currencyMask(value);
    case 'number':
      return numberMask(value);
    case 'decimal':
      return decimalMask(value);
    default:
      return value;
  }
}

/**
 * Hook personalizado para campos mascarados
 * @param {string} initialValue - Valor inicial
 * @param {string} maskType - Tipo de máscara
 * @returns {Array} - [value, setValue, maskedValue]
 */
export function useMaskedInput(initialValue = '', maskType) {
  const [value, setValue] = React.useState(initialValue);

  const maskedValue = React.useMemo(() => {
    return applyMask(value, maskType);
  }, [value, maskType]);

  const handleChange = React.useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return [value, handleChange, maskedValue];
}
