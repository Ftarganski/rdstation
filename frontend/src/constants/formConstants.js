/**
 * Constantes do formulário
 * Centraliza configurações e tipos de dados do formulário
 */

export const RECOMMENDATION_TYPES = {
  SINGLE: 'SingleProduct',
  MULTIPLE: 'MultipleProducts',
};

export const RECOMMENDATION_TYPE_LABELS = {
  [RECOMMENDATION_TYPES.SINGLE]: 'Produto Único',
  [RECOMMENDATION_TYPES.MULTIPLE]: 'Múltiplos Produtos',
};

export const FORM_FIELD_TYPES = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SELECT: 'select',
};

export const FORM_VALIDATION_RULES = {
  MIN_PREFERENCES: 1,
  MIN_FEATURES: 1,
  REQUIRED_RECOMMENDATION_TYPE: true,
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  MIN_SELECTION: (min, type) => `Selecione pelo menos ${min} ${type}`,
  RECOMMENDATION_FAILED: 'Erro ao gerar recomendações. Tente novamente.',
  PRODUCTS_LOAD_FAILED: 'Erro ao carregar produtos. Tente novamente.',
};
