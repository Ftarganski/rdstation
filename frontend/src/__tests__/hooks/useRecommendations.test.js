/**
 * Testes para o hook useRecommendations (versão simplificada)
 * Verifica funcionalidades básicas de geração e gerenciamento de recomendações
 */

import { act, renderHook } from '@testing-library/react';
import useRecommendations from '../../hooks/useRecommendations';
import recommendationService from '../../services/recommendation.service';

// Mock do serviço de recomendações
jest.mock('../../services/recommendation.service', () => ({
  getRecommendations: jest.fn(),
}));

// Suprimir console.error e console.warn durante os testes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Dados mock para testes
const mockProducts = [
  {
    id: 1,
    name: 'RD Station CRM',
    category: 'Vendas',
    preferences: ['Integração fácil com ferramentas de e-mail'],
    features: ['Gestão de leads e oportunidades'],
  },
  {
    id: 2,
    name: 'RD Station Marketing',
    category: 'Marketing',
    preferences: ['Automação de marketing'],
    features: ['Automação de campanhas de marketing'],
  },
];

const mockRecommendations = [
  {
    ...mockProducts[0],
    score: 2,
  },
];

describe('useRecommendations Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useRecommendations());

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.hasRecommendations).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.isReady).toBe(false);
    expect(result.current.errorMessage).toBe(null);
    expect(typeof result.current.generateRecommendations).toBe('function');
    expect(typeof result.current.clearRecommendations).toBe('function');
  });

  test('deve gerar recomendações com sucesso', async () => {
    recommendationService.getRecommendations.mockReturnValue(
      mockRecommendations
    );

    const { result } = renderHook(() => useRecommendations(mockProducts));

    const formData = {
      selectedPreferences: ['Automação de marketing'],
      selectedFeatures: ['Automação de campanhas de marketing'],
      selectedRecommendationType: 'SingleProduct',
    };

    let recommendationResult;
    await act(async () => {
      recommendationResult = await result.current.generateRecommendations(
        formData
      );
    });

    expect(result.current.recommendations).toEqual(mockRecommendations);
    expect(result.current.hasRecommendations).toBe(true);
    expect(result.current.isReady).toBe(true);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(recommendationResult).toEqual(mockRecommendations);

    expect(recommendationService.getRecommendations).toHaveBeenCalledWith(
      formData,
      mockProducts
    );
  });

  test('deve limpar recomendações', async () => {
    recommendationService.getRecommendations.mockReturnValue(
      mockRecommendations
    );

    const { result } = renderHook(() => useRecommendations(mockProducts));

    const formData = {
      selectedPreferences: ['Automação de marketing'],
      selectedFeatures: [],
      selectedRecommendationType: 'SingleProduct',
    };

    // Gerar recomendações primeiro
    await act(async () => {
      await result.current.generateRecommendations(formData);
    });

    expect(result.current.hasRecommendations).toBe(true);

    // Limpar recomendações
    act(() => {
      result.current.clearRecommendations();
    });

    expect(result.current.recommendations).toEqual([]);
    expect(result.current.hasRecommendations).toBe(false);
    expect(result.current.isReady).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBe(null);
  });

  test('deve manter compatibilidade com código existente', () => {
    const { result } = renderHook(() => useRecommendations(mockProducts));

    // Verificar se getRecommendations é igual a generateRecommendations
    expect(result.current.getRecommendations).toBe(
      result.current.generateRecommendations
    );

    // Verificar se setRecommendations existe
    expect(typeof result.current.setRecommendations).toBe('function');

    // Testar setRecommendations
    act(() => {
      result.current.setRecommendations(mockRecommendations);
    });

    expect(result.current.recommendations).toEqual(mockRecommendations);
  });
});
