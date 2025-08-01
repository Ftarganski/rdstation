import { useCallback, useEffect, useMemo, useState } from 'react';
import { productService as getProducts } from '../services';

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
 * Hook personalizado para buscar produtos e extrair todas as
 * preferências e funcionalidades para exibição no formulário.
 *
 * @returns {Object} Objeto contendo produtos, preferências, funcionalidades e estados
 * @returns {Array} returns.products - Lista completa de produtos
 * @returns {Array} returns.availablePreferences - Todas as preferências em ordem alfabética
 * @returns {Array} returns.availableFeatures - Todas as funcionalidades em ordem alfabética
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
   * Busca e processa os dados dos produtos
   */
  const fetchProductsData = useCallback(async () => {
    try {
      setLoadingState(LOADING_STATES.LOADING);
      setErrorMessage(null);

      const productsData = await getProducts();

      if (!Array.isArray(productsData)) {
        throw new Error(
          `Formato de dados inválido recebido da API. Recebido: ${typeof productsData}. Dados: ${JSON.stringify(
            productsData
          )}`
        );
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
   * Extrai todas as preferências de todos os produtos
   */
  const availablePreferences = useMemo(() => {
    const allPreferences = [];

    products.forEach((product) => {
      if (product.preferences && Array.isArray(product.preferences)) {
        // Adiciona TODAS as preferências (não apenas uma amostra)
        allPreferences.push(...product.preferences);
      }
    });

    // Remove duplicatas e ordena alfabeticamente
    const uniquePreferences = [...new Set(allPreferences)];
    return uniquePreferences.sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
  }, [products]);

  /**
   * Extrai todas as funcionalidades de todos os produtos
   */
  const availableFeatures = useMemo(() => {
    const allFeatures = [];

    products.forEach((product) => {
      if (product.features && Array.isArray(product.features)) {
        // Adiciona TODAS as funcionalidades (não apenas uma amostra)
        allFeatures.push(...product.features);
      }
    });

    // Remove duplicatas e ordena alfabeticamente
    const uniqueFeatures = [...new Set(allFeatures)];
    return uniqueFeatures.sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
  }, [products]);

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
