import { useCallback, useMemo, useState } from 'react';
import recommendationService from '../services/recommendation.service';

/**
 * Estados possíveis para o processo de recomendação
 */
const RECOMMENDATION_STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Hook personalizado para gerenciar o sistema de recomendações de produtos.
 * Processa formulários de entrada e gera recomendações usando algoritmo de scoring.
 *
 * @param {Array} availableProducts - Lista de produtos disponíveis para recomendação
 * @returns {Object} Objeto contendo recomendações, estados e funções de controle
 * @returns {Array} returns.recommendations - Lista de produtos recomendados
 * @returns {boolean} returns.isProcessing - Indica se uma recomendação está sendo processada
 * @returns {boolean} returns.hasRecommendations - Indica se existem recomendações disponíveis
 * @returns {boolean} returns.hasError - Indica se houve erro no processo de recomendação
 * @returns {string|null} returns.errorMessage - Mensagem de erro, se houver
 * @returns {Function} returns.generateRecommendations - Função para gerar novas recomendações
 * @returns {Function} returns.clearRecommendations - Função para limpar recomendações atuais
 * @returns {Object} returns.recommendationStats - Estatísticas das recomendações
 */
const useRecommendations = (availableProducts = []) => {
  const [recommendations, setRecommendations] = useState([]);
  const [processingState, setProcessingState] = useState(
    RECOMMENDATION_STATES.IDLE
  );
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Valida os dados do formulário antes de processar recomendações
   * @param {Object} formData - Dados do formulário de recomendação
   * @returns {Object} Resultado da validação
   */
  const validateFormData = useCallback((formData) => {
    const errors = [];

    if (!formData) {
      errors.push('Dados do formulário são obrigatórios');
    }

    const {
      selectedPreferences = [],
      selectedFeatures = [],
      selectedRecommendationType,
    } = formData || {};

    if (selectedPreferences.length === 0 && selectedFeatures.length === 0) {
      errors.push('Selecione pelo menos uma preferência ou funcionalidade');
    }

    if (
      !selectedRecommendationType ||
      selectedRecommendationType.trim() === ''
    ) {
      errors.push('Tipo de recomendação é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  /**
   * Gera recomendações baseadas nos dados do formulário
   * @param {Object} formData - Dados do formulário contendo preferências e tipo de recomendação
   * @returns {Promise<Array>} Promise que resolve com a lista de recomendações
   */
  const generateRecommendations = useCallback(
    async (formData) => {
      try {
        setProcessingState(RECOMMENDATION_STATES.PROCESSING);
        setErrorMessage(null);

        // Validação dos dados de entrada
        const validation = validateFormData(formData);
        if (!validation.isValid) {
          throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
        }

        // Validação dos produtos disponíveis
        if (
          !Array.isArray(availableProducts) ||
          availableProducts.length === 0
        ) {
          throw new Error('Nenhum produto disponível para recomendação');
        }

        // Processamento das recomendações
        const recommendedProducts = recommendationService.getRecommendations(
          formData,
          availableProducts
        );

        if (!Array.isArray(recommendedProducts)) {
          throw new Error(
            'Formato de resposta inválido do serviço de recomendações'
          );
        }

        setRecommendations(recommendedProducts);
        setProcessingState(RECOMMENDATION_STATES.SUCCESS);

        return recommendedProducts;
      } catch (error) {
        console.error('Erro ao gerar recomendações:', error);
        const errorMsg =
          error.message || 'Erro desconhecido ao gerar recomendações';
        setErrorMessage(errorMsg);
        setProcessingState(RECOMMENDATION_STATES.ERROR);
        setRecommendations([]);
        throw new Error(errorMsg);
      }
    },
    [availableProducts, validateFormData]
  );

  /**
   * Limpa as recomendações atuais e reseta o estado
   */
  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setProcessingState(RECOMMENDATION_STATES.IDLE);
    setErrorMessage(null);
  }, []);

  /**
   * Estatísticas derivadas das recomendações atuais
   */
  const recommendationStats = useMemo(() => {
    const totalRecommendations = recommendations.length;
    const uniqueCategories = [
      ...new Set(recommendations.map((product) => product.category)),
    ];
    const averageScore =
      recommendations.length > 0
        ? recommendations.reduce(
            (sum, product) => sum + (product.score || 0),
            0
          ) / recommendations.length
        : 0;

    return {
      totalRecommendations,
      uniqueCategories: uniqueCategories.length,
      categories: uniqueCategories,
      averageScore: Math.round(averageScore * 100) / 100,
    };
  }, [recommendations]);

  // Estados derivados para melhor semântica
  const isProcessing = processingState === RECOMMENDATION_STATES.PROCESSING;
  const hasRecommendations = recommendations.length > 0;
  const hasError = processingState === RECOMMENDATION_STATES.ERROR;
  const isReady = processingState === RECOMMENDATION_STATES.SUCCESS;

  return {
    // Dados principais
    recommendations,
    recommendationStats,

    // Estados
    isProcessing,
    hasRecommendations,
    hasError,
    isReady,
    errorMessage,

    // Ações
    generateRecommendations,
    clearRecommendations,

    // Para compatibilidade com código existente
    setRecommendations,
    getRecommendations: generateRecommendations,
  };
};

export default useRecommendations;
