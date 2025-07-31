import { useCallback, useEffect, useMemo, useState } from 'react';
import getProducts from '../services/product.service';

// Constantes para controle de amostragem
const MAX_PREFERENCES_PER_PRODUCT = 2;
const MAX_FEATURES_PER_PRODUCT = 2;

/**
 * Estados possíveis para o carregamento de dados
 */
const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Hook personalizado para buscar produtos e extrair amostras aleatórias de
 * preferências e funcionalidades para exibição no formulário.
 *
 * @returns {Object} Objeto contendo produtos, preferências, funcionalidades e estados
 * @returns {Array} returns.products - Lista completa de produtos
 * @returns {Array} returns.availablePreferences - Amostra aleatória de preferências
 * @returns {Array} returns.availableFeatures - Amostra aleatória de funcionalidades
 * @returns {boolean} returns.isLoading - Indica se os dados estão sendo carregados
 * @returns {boolean} returns.hasError - Indica se houve erro no carregamento
 * @returns {string|null} returns.errorMessage - Mensagem de erro, se houver
 * @returns {Function} returns.refetchProducts - Função para recarregar os dados
 */
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Gera uma amostra aleatória de um array
   * @param {Array} array - Array original
   * @param {number} maxItems - Número máximo de itens na amostra
   * @returns {Array} Amostra aleatória do array
   */
  const getRandomSample = useCallback((array, maxItems) => {
    if (!Array.isArray(array) || array.length === 0) return [];

    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(maxItems, array.length));
  }, []);

  /**
   * Busca e processa os dados dos produtos
   */
  const fetchProductsData = useCallback(async () => {
    try {
      setLoadingState(LOADING_STATES.LOADING);
      setErrorMessage(null);

      const productsData = await getProducts();

      if (!Array.isArray(productsData)) {
        throw new Error('Formato de dados inválido recebido da API');
      }

      setProducts(productsData);
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setErrorMessage(
        error.message || 'Erro desconhecido ao carregar produtos'
      );
      setLoadingState(LOADING_STATES.ERROR);
      setProducts([]);
    }
  }, []);

  /**
   * Extrai e mistura preferências de todos os produtos
   */
  const availablePreferences = useMemo(() => {
    const allPreferences = [];

    products.forEach((product) => {
      if (product.preferences && Array.isArray(product.preferences)) {
        const samplePreferences = getRandomSample(
          product.preferences,
          MAX_PREFERENCES_PER_PRODUCT
        );
        allPreferences.push(...samplePreferences);
      }
    });

    // Remove duplicatas e retorna uma amostra final
    const uniquePreferences = [...new Set(allPreferences)];
    return getRandomSample(uniquePreferences, uniquePreferences.length);
  }, [products, getRandomSample]);

  /**
   * Extrai e mistura funcionalidades de todos os produtos
   */
  const availableFeatures = useMemo(() => {
    const allFeatures = [];

    products.forEach((product) => {
      if (product.features && Array.isArray(product.features)) {
        const sampleFeatures = getRandomSample(
          product.features,
          MAX_FEATURES_PER_PRODUCT
        );
        allFeatures.push(...sampleFeatures);
      }
    });

    // Remove duplicatas e retorna uma amostra final
    const uniqueFeatures = [...new Set(allFeatures)];
    return getRandomSample(uniqueFeatures, uniqueFeatures.length);
  }, [products, getRandomSample]);

  // Estados derivados para melhor semântica
  const isLoading = loadingState === LOADING_STATES.LOADING;
  const hasError = loadingState === LOADING_STATES.ERROR;
  const isReady = loadingState === LOADING_STATES.SUCCESS;

  // Carrega os dados na inicialização
  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  return {
    // Dados principais
    products,
    availablePreferences,
    availableFeatures,

    // Estados de carregamento
    isLoading,
    hasError,
    isReady,
    errorMessage,

    // Ações
    refetchProducts: fetchProductsData,
  };
};

export default useProducts;
