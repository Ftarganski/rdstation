/**
 * Serviço de Recomendação Refatorado
 * Segue princípios SOLID, especialmente SRP e OCP
 * Modular, extensível e testável
 */

/**
 * Interface para estratégias de scoring
 */
class ScoringStrategy {
  /**
   * Calcula o score de um produto
   * @param {Object} product - Produto a ser avaliado
   * @param {Object} criteria - Critérios de seleção
   * @returns {number} Score do produto
   */
  calculateScore(product, criteria) {
    throw new Error(
      'calculateScore deve ser implementado pela estratégia concreta'
    );
  }
}

/**
 * Estratégia de scoring baseada em correspondência de preferências e funcionalidades
 */
class MatchingScoringStrategy extends ScoringStrategy {
  calculateScore(product, criteria) {
    const { selectedPreferences = [], selectedFeatures = [] } = criteria;

    const preferenceMatches = this.countMatches(
      product.preferences || [],
      selectedPreferences
    );

    const featureMatches = this.countMatches(
      product.features || [],
      selectedFeatures
    );

    // Peso diferente para preferências vs funcionalidades
    return preferenceMatches * 2 + featureMatches * 1.5;
  }

  /**
   * Conta matches entre duas listas (case-insensitive)
   * @param {Array} productItems - Itens do produto
   * @param {Array} selectedItems - Itens selecionados
   * @returns {number} Número de matches
   */
  countMatches(productItems, selectedItems) {
    return productItems.filter((item) =>
      selectedItems.some(
        (selected) =>
          this.normalizeString(selected) === this.normalizeString(item)
      )
    ).length;
  }

  /**
   * Normaliza string para comparação
   * @param {string} str - String a ser normalizada
   * @returns {string} String normalizada
   */
  normalizeString(str) {
    return str.trim().toLowerCase();
  }
}

/**
 * Estratégia de filtering para tipos de recomendação
 */
class RecommendationFilter {
  /**
   * Filtra produtos baseado no tipo de recomendação
   * @param {Array} products - Produtos com score
   * @param {string} recommendationType - Tipo de recomendação
   * @returns {Array} Produtos filtrados
   */
  filter(products, recommendationType) {
    const normalizedType = this.normalizeRecommendationType(recommendationType);

    if (this.isSingleProductType(normalizedType)) {
      return products.length > 0 ? [products[0]] : [];
    }

    return products;
  }

  /**
   * Normaliza tipo de recomendação
   * @param {string} type - Tipo de recomendação
   * @returns {string} Tipo normalizado
   */
  normalizeRecommendationType(type) {
    return (type || '').trim().toLowerCase();
  }

  /**
   * Verifica se é tipo produto único
   * @param {string} type - Tipo normalizado
   * @returns {boolean} É produto único
   */
  isSingleProductType(type) {
    const singleProductTypes = [
      'singleproduct',
      'produto único',
      'produto unico',
      'single',
      'único',
      'unico',
    ];

    return singleProductTypes.includes(type);
  }
}

/**
 * Serviço principal de recomendação
 * Utiliza Strategy Pattern para scoring e filtering
 */
class RecommendationService {
  constructor(
    scoringStrategy = new MatchingScoringStrategy(),
    filter = new RecommendationFilter()
  ) {
    this.scoringStrategy = scoringStrategy;
    this.filter = filter;
  }

  /**
   * Gera recomendações baseadas nos critérios
   * @param {Object} criteria - Critérios de seleção
   * @param {Array} products - Lista de produtos disponíveis
   * @returns {Array} Lista de produtos recomendados
   */
  getRecommendations(criteria = {}, products = []) {
    // Validação de entrada
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    const normalizedCriteria = this.normalizeCriteria(criteria);

    // Calcula scores para todos os produtos
    const scoredProducts = this.calculateScores(products, normalizedCriteria);

    // Filtra produtos com score > 0
    const validProducts = scoredProducts.filter((item) => item.score > 0);

    // Ordena por score (maior primeiro) e depois por ID (desempate)
    const sortedProducts = this.sortProducts(validProducts);

    // Aplica filtro baseado no tipo de recomendação
    const filteredProducts = this.filter.filter(
      sortedProducts,
      normalizedCriteria.recommendationType
    );

    // Retorna apenas os produtos (sem score)
    return filteredProducts.map((item) => item.product);
  }

  /**
   * Normaliza critérios de entrada
   * @param {Object} criteria - Critérios brutos
   * @returns {Object} Critérios normalizados
   */
  normalizeCriteria(criteria) {
    return {
      selectedPreferences: criteria.selectedPreferences || [],
      selectedFeatures: criteria.selectedFeatures || [],
      recommendationType: criteria.recommendationType || 'SingleProduct',
    };
  }

  /**
   * Calcula scores para todos os produtos
   * @param {Array} products - Lista de produtos
   * @param {Object} criteria - Critérios de seleção
   * @returns {Array} Produtos com scores
   */
  calculateScores(products, criteria) {
    return products.map((product) => ({
      product,
      score: this.scoringStrategy.calculateScore(product, criteria),
    }));
  }

  /**
   * Ordena produtos por score e ID
   * @param {Array} products - Produtos com score
   * @returns {Array} Produtos ordenados
   */
  sortProducts(products) {
    return products.sort((a, b) => {
      // Primeiro por score (maior primeiro)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Desempate por ID (menor primeiro)
      return (a.product.id || 0) - (b.product.id || 0);
    });
  }

  /**
   * Define nova estratégia de scoring
   * @param {ScoringStrategy} strategy - Nova estratégia
   */
  setScoringStrategy(strategy) {
    if (!(strategy instanceof ScoringStrategy)) {
      throw new Error('Strategy deve ser uma instância de ScoringStrategy');
    }
    this.scoringStrategy = strategy;
  }

  /**
   * Define novo filtro
   * @param {RecommendationFilter} filter - Novo filtro
   */
  setFilter(filter) {
    if (!(filter instanceof RecommendationFilter)) {
      throw new Error('Filter deve ser uma instância de RecommendationFilter');
    }
    this.filter = filter;
  }
}

// Instância padrão do serviço
const recommendationService = new RecommendationService();

// API de compatibilidade com o serviço anterior
const recommendationServiceAPI = {
  getRecommendations: (criteria, products) =>
    recommendationService.getRecommendations(criteria, products),
  service: recommendationService,
};

// Exporta tanto a instância quanto as classes para extensibilidade
export {
  MatchingScoringStrategy,
  RecommendationFilter,
  RecommendationService,
  ScoringStrategy,
};

export default recommendationServiceAPI;
