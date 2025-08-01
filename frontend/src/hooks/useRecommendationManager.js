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
    minScore: 0,
    sortBy: 'score',
    sortOrder: 'desc',
  });

  // Função para filtrar recomendações (memoizada para performance)
  const applyFilters = useCallback((recommendations, filters) => {
    if (!recommendations || recommendations.length === 0) return [];

    let filtered = [...recommendations];

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

    // Filtro por score mínimo
    if (filters.minScore > 0) {
      filtered = filtered.filter((rec) => (rec.score || 0) >= filters.minScore);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
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
          aValue = a.score || 0;
          bValue = b.score || 0;
      }

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
        setRecommendations(result);
        setFilteredRecommendations(result);

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
    [products]
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
