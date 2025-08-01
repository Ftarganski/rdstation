/**
 * Testes para o hook useRecommendationManager
 * Verifica funcionalidades de gerenciamento de recomendações e filtros
 */

import { recommendationService } from '@/services';
import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useRecommendationManager } from '../../hooks/useRecommendationManager';

// Mock do serviço de recomendações
vi.mock('@/services', () => ({
  recommendationService: {
    getRecommendations: vi.fn(),
  },
}));

// Suprimir console.error e console.warn durante os testes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

beforeEach(() => {
  vi.clearAllMocks();
});

// Mock de produtos para testes
const mockProducts = [
  {
    id: 1,
    name: 'Produto A',
    category: 'Categoria 1',
    description: 'Descrição do Produto A',
    preferences: ['pref1'],
    features: ['feat1'],
  },
  {
    id: 2,
    name: 'Produto B',
    category: 'Categoria 2',
    description: 'Descrição do Produto B',
    preferences: ['pref2'],
    features: ['feat2'],
  },
];

const mockRecommendations = [
  {
    id: 1,
    name: 'Produto A',
    category: 'Categoria 1',
    description: 'Descrição do Produto A',
    score: 5,
  },
  {
    id: 2,
    name: 'Produto B',
    category: 'Categoria 2',
    description: 'Descrição do Produto B',
    score: 3,
  },
];

describe('useRecommendationManager Hook', () => {
  test('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useRecommendationManager(mockProducts));

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.filteredRecommendations).toEqual([]);
    expect(result.current.selectedRecommendation).toBe(null);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.filters).toEqual({
      search: '',
      category: '',
      sortBy: 'ranking',
      sortOrder: 'asc',
    });
    expect(typeof result.current.generateRecommendations).toBe('function');
    expect(typeof result.current.resetRecommendations).toBe('function');
    expect(typeof result.current.selectRecommendation).toBe('function');
    expect(typeof result.current.handleFiltersChange).toBe('function');
  });

  test('deve gerar recomendações com sucesso', async () => {
    recommendationService.getRecommendations.mockResolvedValue(
      mockRecommendations
    );

    const { result } = renderHook(() => useRecommendationManager(mockProducts));
    const formData = {
      selectedPreferences: ['pref1'],
      selectedFeatures: ['feat1'],
      recommendationType: 'MultipleProducts',
    };

    act(() => {
      result.current.generateRecommendations(formData);
    });

    expect(result.current.isProcessing).toBe(true);

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
    });

    expect(result.current.recommendations).toEqual(mockRecommendations);
    expect(result.current.filteredRecommendations).toHaveLength(2);
    expect(result.current.error).toBe(null);
  });

  test('deve lidar com erro ao gerar recomendações', async () => {
    const errorMessage = 'Erro no serviço';
    recommendationService.getRecommendations.mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useRecommendationManager(mockProducts));
    const formData = {
      selectedPreferences: ['pref1'],
      selectedFeatures: ['feat1'],
      recommendationType: 'MultipleProducts',
    };

    act(() => {
      result.current.generateRecommendations(formData);
    });

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
    });

    expect(result.current.error).toBe(
      'Erro ao gerar recomendações. Tente novamente.'
    );
    expect(result.current.recommendations).toEqual([]);
    expect(result.current.filteredRecommendations).toEqual([]);
  });

  test('deve mostrar erro quando não há produtos disponíveis', async () => {
    const { result } = renderHook(() => useRecommendationManager([]));
    const formData = {
      selectedPreferences: ['pref1'],
      selectedFeatures: ['feat1'],
      recommendationType: 'MultipleProducts',
    };

    act(() => {
      result.current.generateRecommendations(formData);
    });

    await waitFor(() => {
      expect(result.current.error).toBe(
        'Nenhum produto disponível para recomendação'
      );
    });
  });

  test('deve resetar recomendações', () => {
    const { result } = renderHook(() => useRecommendationManager(mockProducts));

    // Primeiro definir alguns valores
    act(() => {
      result.current.selectRecommendation(mockRecommendations[0]);
    });

    // Depois resetar
    act(() => {
      result.current.resetRecommendations();
    });

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.filteredRecommendations).toEqual([]);
    expect(result.current.selectedRecommendation).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test('deve selecionar recomendação', () => {
    const { result } = renderHook(() => useRecommendationManager(mockProducts));
    const recommendation = mockRecommendations[0];

    act(() => {
      result.current.selectRecommendation(recommendation);
    });

    expect(result.current.selectedRecommendation).toEqual(recommendation);
  });

  test('deve filtrar por busca textual', async () => {
    recommendationService.getRecommendations.mockResolvedValue(
      mockRecommendations
    );

    const { result } = renderHook(() => useRecommendationManager(mockProducts));

    // Primeiro gerar recomendações
    await act(async () => {
      await result.current.generateRecommendations({
        selectedPreferences: ['pref1'],
        selectedFeatures: ['feat1'],
        recommendationType: 'MultipleProducts',
      });
    });

    // Depois aplicar filtro de busca
    act(() => {
      result.current.handleFiltersChange({
        ...result.current.filters,
        search: 'Produto A',
      });
    });

    expect(result.current.filteredRecommendations).toHaveLength(1);
    expect(result.current.filteredRecommendations[0].name).toBe('Produto A');
  });

  test('deve filtrar por categoria', async () => {
    recommendationService.getRecommendations.mockResolvedValue(
      mockRecommendations
    );

    const { result } = renderHook(() => useRecommendationManager(mockProducts));

    // Primeiro gerar recomendações
    await act(async () => {
      await result.current.generateRecommendations({
        selectedPreferences: ['pref1'],
        selectedFeatures: ['feat1'],
        recommendationType: 'MultipleProducts',
      });
    });

    // Depois aplicar filtro de categoria
    act(() => {
      result.current.handleFiltersChange({
        ...result.current.filters,
        category: 'Categoria 1',
      });
    });

    expect(result.current.filteredRecommendations).toHaveLength(1);
    expect(result.current.filteredRecommendations[0].category).toBe(
      'Categoria 1'
    );
  });

  test('deve ordenar por score', async () => {
    const recommendationsUnsorted = [
      { ...mockRecommendations[1], score: 3 },
      { ...mockRecommendations[0], score: 5 },
    ];

    recommendationService.getRecommendations.mockResolvedValue(
      recommendationsUnsorted
    );

    const { result } = renderHook(() => useRecommendationManager(mockProducts));

    // Primeiro gerar recomendações
    await act(async () => {
      await result.current.generateRecommendations({
        selectedPreferences: ['pref1'],
        selectedFeatures: ['feat1'],
        recommendationType: 'MultipleProducts',
      });
    });

    // Aplicar ordenação por score descendente
    act(() => {
      result.current.handleFiltersChange({
        ...result.current.filters,
        sortBy: 'score',
        sortOrder: 'desc',
      });
    });

    expect(result.current.filteredRecommendations[0].score).toBe(5);
    expect(result.current.filteredRecommendations[1].score).toBe(3);
  });

  test('deve lidar com recomendações vazias', async () => {
    recommendationService.getRecommendations.mockResolvedValue([]);

    const { result } = renderHook(() => useRecommendationManager(mockProducts));

    act(() => {
      result.current.generateRecommendations({
        selectedPreferences: ['pref1'],
        selectedFeatures: ['feat1'],
        recommendationType: 'MultipleProducts',
      });
    });

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
    });

    expect(result.current.error).toBe(
      'Nenhuma recomendação encontrada para os critérios selecionados'
    );
    expect(result.current.recommendations).toEqual([]);
    expect(result.current.filteredRecommendations).toEqual([]);
  });
});
