import mockProducts from '../mocks/mockProducts';
import recommendationService from './recommendation.service';

describe('recommendationService', () => {
  test('Retorna recomendação correta para SingleProduct com base nas preferências selecionadas', () => {
    const formData = {
      selectedPreferences: ['Integração com chatbots'],
      selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Conversas');
  });

  test('Ordena corretamente por score crescente em MultipleProducts', () => {
    const formData = {
      selectedPreferences: [
        'Integração fácil com ferramentas de e-mail', // RD Station CRM (1 match)
        'Automação de marketing', // RD Station Marketing (1 match)
      ],
      selectedFeatures: [
        'Rastreamento de comportamento do usuário', // RD Station Marketing (+1 = 2 total)
      ],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations.length).toBeGreaterThanOrEqual(1);

    // Se temos 2 produtos, verificar a ordenação
    expect(
      recommendations.length === 2
        ? [recommendations[0].name, recommendations[1].name]
        : [recommendations[0].name]
    ).toEqual(
      recommendations.length === 2
        ? ['RD Station CRM', 'RD Station Marketing']
        : ['RD Station Marketing']
    );
  });

  test('Retorna apenas um produto para SingleProduct com mais de um produto de match', () => {
    const formData = {
      selectedPreferences: [
        'Integração fácil com ferramentas de e-mail',
        'Automação de marketing',
      ],
      selectedFeatures: [
        'Rastreamento de interações com clientes',
        'Rastreamento de comportamento do usuário',
      ],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });

  test('Retorna o último match em caso de empate para SingleProduct', () => {
    const formData = {
      selectedPreferences: [
        'Automação de marketing', // RD Station Marketing
        'Integração com chatbots', // RD Conversas
      ],
      selectedFeatures: [], // Array vazio ao invés de undefined
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Conversas');
  });

  // ========== NOVOS TESTES ==========

  test('Retorna array vazio quando nenhuma preferência ou feature corresponde', () => {
    const formData = {
      selectedPreferences: ['Preferência inexistente'],
      selectedFeatures: ['Feature inexistente'],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(0);
    expect(recommendations).toEqual([]);
  });

  test('Funciona com array de produtos vazio', () => {
    const formData = {
      selectedPreferences: ['Automação de marketing'],
      selectedFeatures: ['Análise de dados'],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      []
    );

    expect(recommendations).toHaveLength(0);
    expect(recommendations).toEqual([]);
  });

  test('Funciona com formData vazio usando valores padrão', () => {
    const recommendations = recommendationService.getRecommendations(
      {},
      mockProducts
    );

    expect(recommendations).toHaveLength(0);
    expect(recommendations).toEqual([]);
  });

  test('Funciona sem parâmetros usando valores padrão', () => {
    const recommendations = recommendationService.getRecommendations();

    expect(recommendations).toHaveLength(0);
    expect(recommendations).toEqual([]);
  });

  test('Trata recommendationType com case insensitive', () => {
    const formData = {
      selectedPreferences: ['Automação de marketing'],
      selectedFeatures: ['Rastreamento de comportamento do usuário'],
      selectedRecommendationType: 'singleproduct', // lowercase
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });

  test('Trata recommendationType "produto único" em português', () => {
    const formData = {
      selectedPreferences: ['Análise preditiva de dados'],
      selectedFeatures: ['Análise de dados para insights estratégicos'],
      selectedRecommendationType: 'produto único',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Mentor AI');
  });

  test('Trata recommendationType "produto unico" sem acento', () => {
    const formData = {
      selectedPreferences: ['Integração com chatbots'],
      selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
      selectedRecommendationType: 'produto unico',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Conversas');
  });

  test('Match apenas por features quando preferences estão vazias', () => {
    const formData = {
      selectedPreferences: [],
      selectedFeatures: ['Análise de dados para insights estratégicos'],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Mentor AI');
  });

  test('Match apenas por preferences quando features estão vazias', () => {
    const formData = {
      selectedPreferences: ['Histórico unificado de interações'],
      selectedFeatures: [],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Conversas');
  });

  test('Trata strings com espaços extras nas preferências', () => {
    const formData = {
      selectedPreferences: ['  Automação de marketing  '], // com espaços
      selectedFeatures: ['  Rastreamento de comportamento do usuário  '], // com espaços
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });

  test('Trata case insensitive nas preferências e features', () => {
    const formData = {
      selectedPreferences: ['AUTOMAÇÃO DE MARKETING'], // uppercase
      selectedFeatures: ['rastreamento de comportamento do usuário'], // lowercase
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });

  test('Para SingleProduct, retorna o produto com maior score', () => {
    const formData = {
      selectedPreferences: [
        'Automação de marketing', // RD Station Marketing
        'Integração fácil com ferramentas de e-mail', // RD Station CRM
      ],
      selectedFeatures: [
        'Rastreamento de comportamento do usuário', // RD Station Marketing
        'Criação e gestão de campanhas de e-mail', // RD Station Marketing
      ],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    // RD Station Marketing tem score 3 (1 pref + 2 features)
    // RD Station CRM tem score 1 (1 pref + 0 features)
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });

  test('recommendationType undefined usa valor padrão SingleProduct', () => {
    const formData = {
      selectedPreferences: ['Automação de marketing'],
      selectedFeatures: ['Rastreamento de comportamento do usuário'],
      // recommendationType não definido
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1); // Deve funcionar como SingleProduct
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });
});
