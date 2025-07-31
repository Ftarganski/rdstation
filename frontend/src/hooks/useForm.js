import { useCallback, useState } from 'react';

/**
 * Hook personalizado para gerenciar estado de formulários de forma reativa.
 *
 * @param {Object} initialFormState - Estado inicial do formulário
 * @param {Array<string>} [initialFormState.selectedPreferences=[]] - Preferências selecionadas
 * @param {Array<string>} [initialFormState.selectedFeatures=[]] - Funcionalidades selecionadas
 * @param {string} [initialFormState.selectedRecommendationType=''] - Tipo de recomendação
 * @returns {Object} Objeto contendo o estado do formulário e função para atualizá-lo
 * @returns {Object} returns.formData - Dados atuais do formulário
 * @returns {Function} returns.updateFormField - Função para atualizar um campo específico
 * @returns {Function} returns.resetForm - Função para resetar o formulário ao estado inicial
 * @returns {Function} returns.setFormData - Função para definir todo o estado do formulário
 */
const useForm = (initialFormState = {}) => {
  const [formData, setFormData] = useState(initialFormState);

  /**
   * Atualiza um campo específico do formulário de forma imutável
   * @param {string} fieldName - Nome do campo a ser atualizado
   * @param {any} fieldValue - Novo valor para o campo
   */
  const updateFormField = useCallback((fieldName, fieldValue) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      [fieldName]: fieldValue,
    }));
  }, []);

  /**
   * Reseta o formulário para o estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
  }, [initialFormState]);

  return {
    formData,
    updateFormField,
    resetForm,
    setFormData,
  };
};

export default useForm;
