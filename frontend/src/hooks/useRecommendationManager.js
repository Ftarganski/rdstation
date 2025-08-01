/**
 * Hook customizado para gerenciar recomendações e filtros
 */

import { recommendationService } from '@/services';
import { useCallback, useEffect, useState } from 'react';

export const useRecommendationManager = (products) => {
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'ranking',
    sortOrder: 'asc',
  });

  // Função para filtrar recomendações (memoizada para performance)
  const applyFilters = useCallback((recommendations, filters) => {
    if (!recommendations || recommendations.length === 0) return [];

    // Primeiro, calcular o ranking baseado no score
    const recommendationsWithRanking = [...recommendations]
      .sort((a, b) => {
        if (b.score !== a.score) {
          return (b.score || 0) - (a.score || 0);
        }
        // Em caso de empate no score, ID maior (mais novo) fica em primeiro
        return (b.id || 0) - (a.id || 0);
      })
      .map((rec, index) => ({
        ...rec,
        ranking: index + 1,
      }));

    let filtered = [...recommendationsWithRanking];

    // Filtro por busca textual
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (rec) =>
          rec.name?.toLowerCase().includes(searchTerm) ||
          rec.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por categoria
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter((rec) => rec.category === filters.category);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'ranking':
          aValue = a.ranking || 999;
          bValue = b.ranking || 999;
          break;
        case 'score':
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        default:
          aValue = a.ranking || 999;
          bValue = b.ranking || 999;
      }

      // Para ranking: asc = melhor ranking primeiro (1,2,3...), desc = pior ranking primeiro (10,9,8...)
      // Para outros: asc = crescente, desc = decrescente
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, []);

  // Handler para mudança de filtros
  const handleFiltersChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      const filtered = applyFilters(recommendations, newFilters);
      setFilteredRecommendations(filtered);
    },
    [recommendations, applyFilters]
  );

  // Atualiza recomendações filtradas quando as recomendações ou filtros mudam
  useEffect(() => {
    const filtered = applyFilters(recommendations, filters);
    setFilteredRecommendations(filtered);
  }, [recommendations, filters, applyFilters]);

  /**
   * Gera recomendações com base nos dados do formulário
   */
  const generateRecommendations = useCallback(
    async (formData) => {
      if (!products || products.length === 0) {
        setError('Nenhum produto disponível para recomendação');
        return;
      }

      setIsProcessing(true);
      setError(null);
      setSelectedRecommendation(null);

      try {
        const result = await recommendationService.getRecommendations(
          formData,
          products
        );

        // Ordenar inicialmente por ranking (melhor score primeiro)
        const sortedResult = result.sort((a, b) => {
          if (b.score !== a.score) {
            return (b.score || 0) - (a.score || 0);
          }
          // Em caso de empate no score, ID maior (mais novo) fica em primeiro
          return (b.id || 0) - (a.id || 0);
        });

        setRecommendations(sortedResult);

        // Aplicar filtros padrão (ranking)
        const filtered = applyFilters(sortedResult, filters);
        setFilteredRecommendations(filtered);

        if (result.length === 0) {
          setError(
            'Nenhuma recomendação encontrada para os critérios selecionados'
          );
        }
      } catch (error) {
        console.error('Erro ao gerar recomendações:', error);
        setError('Erro ao gerar recomendações. Tente novamente.');
        setRecommendations([]);
        setFilteredRecommendations([]);
      } finally {
        setIsProcessing(false);
      }
    },
    [products, applyFilters, filters]
  );

  /**
   * Limpa as recomendações
   */
  const resetRecommendations = useCallback(() => {
    setRecommendations([]);
    setFilteredRecommendations([]);
    setSelectedRecommendation(null);
    setError(null);
  }, []);

  /**
   * Seleciona uma recomendação específica
   */
  const selectRecommendation = useCallback((recommendation) => {
    setSelectedRecommendation(recommendation);
  }, []);

  return {
    // Estados
    recommendations,
    filteredRecommendations,
    selectedRecommendation,
    isProcessing,
    error,
    filters,

    // Handlers
    generateRecommendations,
    resetRecommendations,
    selectRecommendation,
    handleFiltersChange,
  };
};
