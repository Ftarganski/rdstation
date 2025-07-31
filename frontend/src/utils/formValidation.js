/**
 * Utilitários para validação de formulários
 * Funções reutilizáveis para validação seguindo o princípio DRY
 */

import {
  ERROR_MESSAGES,
  FORM_VALIDATION_RULES,
} from '../constants/formConstants';

/**
 * Valida se um array não está vazio
 * @param {Array} array - Array a ser validado
 * @param {number} minLength - Tamanho mínimo
 * @returns {boolean}
 */
export const isArrayNotEmpty = (array, minLength = 1) => {
  return Array.isArray(array) && array.length >= minLength;
};

/**
 * Valida se um valor não está vazio
 * @param {*} value - Valor a ser validado
 * @returns {boolean}
 */
export const isNotEmpty = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value != null;
};

/**
 * Valida dados do formulário
 * @param {Object} formData - Dados do formulário
 * @returns {Object} Resultado da validação com erros
 */
export const validateFormData = (formData) => {
  const errors = {};
  const { selectedPreferences, selectedFeatures, selectedRecommendationType } =
    formData;

  // Valida preferências
  if (
    !isArrayNotEmpty(selectedPreferences, FORM_VALIDATION_RULES.MIN_PREFERENCES)
  ) {
    errors.preferences = ERROR_MESSAGES.MIN_SELECTION(
      FORM_VALIDATION_RULES.MIN_PREFERENCES,
      'preferência(s)'
    );
  }

  // Valida funcionalidades
  if (!isArrayNotEmpty(selectedFeatures, FORM_VALIDATION_RULES.MIN_FEATURES)) {
    errors.features = ERROR_MESSAGES.MIN_SELECTION(
      FORM_VALIDATION_RULES.MIN_FEATURES,
      'funcionalidade(s)'
    );
  }

  // Valida tipo de recomendação
  if (
    FORM_VALIDATION_RULES.REQUIRED_RECOMMENDATION_TYPE &&
    !isNotEmpty(selectedRecommendationType)
  ) {
    errors.recommendationType = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Normaliza dados do formulário para o serviço
 * @param {Object} formData - Dados brutos do formulário
 * @returns {Object} Dados normalizados
 */
export const normalizeFormData = (formData) => {
  return {
    selectedPreferences: formData.selectedPreferences || [],
    selectedFeatures: formData.selectedFeatures || [],
    recommendationType: formData.selectedRecommendationType || '',
  };
};
