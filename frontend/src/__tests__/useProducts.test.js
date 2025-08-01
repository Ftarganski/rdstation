/**
 * Testes para o hook useProducts
 * Verifica funcionalidades de carregamento e processamento de produtos
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import useProducts from '../hooks/useProducts';
import getProducts from '../services/product.service';

// Mock do serviço de produtos
jest.mock('../services/product.service');

// Mock dos dados de produtos
const mockProductsData = [
  {
    id: 1,
    name: 'RD Station CRM',
    category: 'Vendas',
    preferences: [
      'Integração fácil com ferramentas de e-mail',
      'Personalização de funis de vendas',
      'Relatórios avançados de desempenho de vendas',
      'Gestão de pipeline de vendas',
    ],
    features: [
      'Gestão de leads e oportunidades',
      'Pipeline de vendas personalizável',
      'Rastreamento de interações com clientes',
      'Relatórios de desempenho de vendas',
      'Integração com ferramentas de e-mail',
    ],
  },
  {
    id: 2,
    name: 'RD Station Marketing',
    category: 'Marketing',
    preferences: [
      'Automação de marketing',
      'Criação de landing pages',
      'Análise de resultados de campanhas',
      'Segmentação de leads',
    ],
    features: [
      'Automação de campanhas de marketing',
      'Criação e gestão de campanhas de e-mail',
      'Landing pages otimizadas para conversão',
      'Rastreamento de comportamento do usuário',
      'Segmentação avançada de leads',
    ],
  },
];

describe('useProducts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve inicializar com estado padrão', async () => {
    const { result } = renderHook(() => useProducts());

    // Aguardar um pouco para permitir que useEffect execute
    await waitFor(() => {
      expect(result.current.products).toEqual([]);
    });

    expect(result.current.availablePreferences).toEqual([]);
    expect(result.current.availableFeatures).toEqual([]);
    expect(typeof result.current.refetchProducts).toBe('function');
    // Não testamos isLoading no início pois o useEffect pode ter executado
  });

  test('deve carregar produtos com sucesso', async () => {
    getProducts.mockResolvedValue(mockProductsData);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProductsData);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBe(null);
    expect(getProducts).toHaveBeenCalledTimes(1);
  });

  test('deve extrair amostras de preferências', async () => {
    getProducts.mockResolvedValue(mockProductsData);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.availablePreferences.length).toBeGreaterThan(0);
    });

    // Verificar se as preferências são um subconjunto das preferências originais
    const todasPreferencias = mockProductsData.flatMap((p) => p.preferences);
    result.current.availablePreferences.forEach((pref) => {
      expect(todasPreferencias).toContain(pref);
    });

    // Verificar limite máximo (2 por produto)
    expect(result.current.availablePreferences.length).toBeLessThanOrEqual(4);
  });

  test('deve extrair amostras de features', async () => {
    getProducts.mockResolvedValue(mockProductsData);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.availableFeatures.length).toBeGreaterThan(0);
    });

    // Verificar se as features são um subconjunto das features originais
    const todasFeatures = mockProductsData.flatMap((p) => p.features);
    result.current.availableFeatures.forEach((feature) => {
      expect(todasFeatures).toContain(feature);
    });

    // Verificar limite máximo (2 por produto)
    expect(result.current.availableFeatures.length).toBeLessThanOrEqual(4);
  });

  test('deve gerenciar estado de loading corretamente', async () => {
    let resolvePromise;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    getProducts.mockReturnValue(delayedPromise);

    const { result } = renderHook(() => useProducts());

    // Estado inicial deve ser loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.products).toEqual([]);

    // Resolver a promise
    resolvePromise(mockProductsData);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProductsData);
  });

  test('deve tratar erro no carregamento de produtos', async () => {
    const errorMessage = 'Erro ao carregar produtos';
    getProducts.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.errorMessage).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.products).toEqual([]);
    expect(result.current.availablePreferences).toEqual([]);
    expect(result.current.availableFeatures).toEqual([]);
  });

  test('deve validar formato dos dados recebidos', async () => {
    getProducts.mockResolvedValue('dados inválidos');

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.errorMessage).toBe(
      'Formato de dados inválido recebido da API'
    );
    expect(result.current.products).toEqual([]);
  });

  test('deve permitir recarregar produtos com refetchProducts', async () => {
    getProducts.mockResolvedValue(mockProductsData);

    const { result } = renderHook(() => useProducts());

    // Aguardar carregamento inicial
    await waitFor(() => {
      expect(result.current.products).toEqual(mockProductsData);
    });

    expect(getProducts).toHaveBeenCalledTimes(1);

    // Simular erro para depois recarregar
    getProducts.mockRejectedValueOnce(new Error('Erro temporário'));

    await act(async () => {
      await result.current.refetchProducts();
    });

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    // Recarregar com sucesso
    getProducts.mockResolvedValue(mockProductsData);

    await act(async () => {
      await result.current.refetchProducts();
    });

    await waitFor(() => {
      expect(result.current.hasError).toBe(false);
    });

    expect(result.current.products).toEqual(mockProductsData);
    expect(getProducts).toHaveBeenCalledTimes(3); // inicial + 2 refetch
  });

  test('deve lidar com array vazio de produtos', async () => {
    getProducts.mockResolvedValue([]);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.products).toEqual([]);
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.availablePreferences).toEqual([]);
    expect(result.current.availableFeatures).toEqual([]);
  });

  test('deve remover duplicatas das preferências', async () => {
    const produtosComDuplicatas = [
      {
        id: 1,
        name: 'Produto 1',
        preferences: ['Preferência A', 'Preferência B'],
        features: ['Feature A'],
      },
      {
        id: 2,
        name: 'Produto 2',
        preferences: ['Preferência A', 'Preferência C'], // Preferência A duplicada
        features: ['Feature B'],
      },
    ];

    getProducts.mockResolvedValue(produtosComDuplicatas);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.availablePreferences.length).toBeGreaterThan(0);
    });

    // Verificar que não há duplicatas
    const preferenciasUnicas = [
      ...new Set(result.current.availablePreferences),
    ];
    expect(result.current.availablePreferences.length).toBe(
      preferenciasUnicas.length
    );
  });

  test('deve remover duplicatas das features', async () => {
    const produtosComDuplicatas = [
      {
        id: 1,
        name: 'Produto 1',
        preferences: ['Preferência A'],
        features: ['Feature A', 'Feature B'],
      },
      {
        id: 2,
        name: 'Produto 2',
        preferences: ['Preferência B'],
        features: ['Feature A', 'Feature C'], // Feature A duplicada
      },
    ];

    getProducts.mockResolvedValue(produtosComDuplicatas);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.availableFeatures.length).toBeGreaterThan(0);
    });

    // Verificar que não há duplicatas
    const featuresUnicas = [...new Set(result.current.availableFeatures)];
    expect(result.current.availableFeatures.length).toBe(featuresUnicas.length);
  });

  test('deve lidar com produtos sem preferências ou features', async () => {
    const produtosSemDados = [
      {
        id: 1,
        name: 'Produto Incompleto',
        preferences: [],
        features: [],
      },
      {
        id: 2,
        name: 'Produto Sem Campos',
        // preferences e features ausentes
      },
    ];

    getProducts.mockResolvedValue(produtosSemDados);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.products).toEqual(produtosSemDados);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.availablePreferences).toEqual([]);
    expect(result.current.availableFeatures).toEqual([]);
  });

  test('deve tratar erro sem mensagem específica', async () => {
    const errorSemMensagem = new Error();
    getProducts.mockRejectedValue(errorSemMensagem);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.errorMessage).toBe(
      'Erro desconhecido ao carregar produtos'
    );
  });
});
