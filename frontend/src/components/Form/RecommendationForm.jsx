/**
 * Formulário de Recomendações Refatorado
 * Segue princípios SOLID, DRY e Clean Code
 * Utiliza composição e separação de responsabilidades
 */

import {
  ErrorState,
  FeaturesField,
  LoadingState,
  PreferencesField,
  RecommendationTypeField,
  SubmitButton,
} from "@/components";
import { useProducts } from "@/hooks";
import { normalizeFormData, validateFormData } from "@/utils/formValidation";
import PropTypes from "prop-types";
import { memo, useCallback, useState } from "react";

/**
 * Hook customizado para gerenciar estado do formulário de recomendações
 */
const useRecommendationForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    selectedPreferences: [],
    selectedFeatures: [],
    selectedRecommendationType: "",
    ...initialData,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(
    (fieldName, value) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      // Limpa erro de validação do campo quando alterado
      if (validationErrors[fieldName]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const resetForm = useCallback(() => {
    setFormData({
      selectedPreferences: [],
      selectedFeatures: [],
      selectedRecommendationType: "",
    });
    setValidationErrors({});
    setIsSubmitting(false);
  }, []);

  const validateForm = useCallback(() => {
    const validation = validateFormData(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  return {
    formData,
    validationErrors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    resetForm,
    validateForm,
    normalizedData: normalizeFormData(formData),
  };
};

/**
 * Componente principal do formulário de recomendações
 * @param {Object} props - Propriedades do componente
 */
const RecommendationForm = memo(
  ({
    onSubmit,
    onReset,
    className = "",
    disabled = false,
    "data-testid": testId = "recommendation-form",
  }) => {
    const {
      availablePreferences,
      availableFeatures,
      isLoading: isLoadingProducts,
      hasError: hasProductsError,
      errorMessage: productsErrorMessage,
      refetchProducts,
    } = useProducts();

    const {
      formData,
      validationErrors,
      isSubmitting,
      setIsSubmitting,
      updateField,
      resetForm,
      validateForm,
      normalizedData,
    } = useRecommendationForm();

    const handleSubmit = useCallback(
      async (event) => {
        event.preventDefault();

        if (disabled || isSubmitting) return;

        if (!validateForm()) {
          return;
        }

        setIsSubmitting(true);

        try {
          await onSubmit?.(normalizedData);
        } catch (error) {
          console.error("Erro ao processar formulário:", error);
        } finally {
          setIsSubmitting(false);
        }
      },
      [
        disabled,
        isSubmitting,
        validateForm,
        onSubmit,
        normalizedData,
        setIsSubmitting,
      ]
    );

    const handleReset = useCallback(() => {
      resetForm();
      onReset?.();
    }, [resetForm, onReset]);

    const handlePreferencesChange = useCallback(
      (preferences) => {
        updateField("selectedPreferences", preferences);
      },
      [updateField]
    );

    const handleFeaturesChange = useCallback(
      (features) => {
        updateField("selectedFeatures", features);
      },
      [updateField]
    );

    const handleRecommendationTypeChange = useCallback(
      (type) => {
        updateField("selectedRecommendationType", type);
      },
      [updateField]
    );

    // Estado de loading dos produtos
    if (isLoadingProducts) {
      return (
        <div className={`w-full ${className}`} data-testid={testId}>
          <LoadingState
            message="Carregando opções do formulário..."
            size="medium"
          />
        </div>
      );
    }

    // Estado de erro dos produtos
    if (hasProductsError) {
      return (
        <div className={`w-full ${className}`} data-testid={testId}>
          <ErrorState
            title="Erro ao carregar dados"
            message={productsErrorMessage}
            onRetry={refetchProducts}
            retryText="Recarregar dados"
          />
        </div>
      );
    }

    return (
      <form
        className={`w-full p-6 rounded-lg space-y-6 ${className}`}
        onSubmit={handleSubmit}
        noValidate
        data-testid={testId}
      >
        {/* Grid de 2 colunas para campos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna 1: Preferências */}
          <div className="space-y-4">
            <PreferencesField
              preferences={availablePreferences}
              initialSelected={formData.selectedPreferences}
              onChange={handlePreferencesChange}
              disabled={disabled || isSubmitting}
              required
              className={validationErrors.preferences ? "border-rd-error" : ""}
            />

            {validationErrors.preferences && (
              <p className="text-rd-error text-sm mt-1" role="alert">
                {validationErrors.preferences}
              </p>
            )}
          </div>

          {/* Coluna 2: Funcionalidades */}
          <div className="space-y-4">
            <FeaturesField
              features={availableFeatures}
              initialSelected={formData.selectedFeatures}
              onChange={handleFeaturesChange}
              disabled={disabled || isSubmitting}
              required
              className={validationErrors.features ? "border-rd-error" : ""}
            />

            {validationErrors.features && (
              <p className="text-rd-error text-sm mt-1" role="alert">
                {validationErrors.features}
              </p>
            )}
          </div>
        </div>

        {/* Seção do tipo de recomendação - largura completa */}
        <div className="space-y-4">
          <RecommendationTypeField
            initialValue={formData.selectedRecommendationType}
            onChange={handleRecommendationTypeChange}
            disabled={disabled || isSubmitting}
            required
            className={
              validationErrors.recommendationType ? "border-rd-error" : ""
            }
          />

          {validationErrors.recommendationType && (
            <p className="text-rd-error text-sm mt-1" role="alert">
              {validationErrors.recommendationType}
            </p>
          )}
        </div>

        {/* Botões na parte inferior */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-rd-gray">
          <SubmitButton
            text={isSubmitting ? "Processando..." : "Obter Recomendações"}
            disabled={disabled || isSubmitting}
            isLoading={isSubmitting}
            className="flex-1 button-scale"
          />

          <button
            type="button"
            onClick={handleReset}
            disabled={disabled || isSubmitting}
            className="flex-1 bg-rd-gray text-rd-white py-3 px-6 rounded-lg font-medium hover:bg-rd-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed button-scale"
            data-testid="reset-button"
          >
            Limpar Formulário
          </button>
        </div>
      </form>
    );
  }
);

RecommendationForm.propTypes = {
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  "data-testid": PropTypes.string,
};

RecommendationForm.displayName = "RecommendationForm";

export default RecommendationForm;
