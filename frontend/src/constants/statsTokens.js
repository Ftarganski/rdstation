/**
 * Design tokens para estatísticas
 * Centraliza as configurações de cores e temas dos cards de estatística
 */

// Tokens de cores para os tipos de estatística
export const STATS_COLOR_TOKENS = {
  // Estatísticas principais (azul primário)
  PRIMARY: 'rd-blue',

  // Estatísticas de performance (cyan secundário)
  PERFORMANCE: 'rd-cyan',

  // Estatísticas de sucesso (verde)
  SUCCESS: 'rd-green',

  // Estatísticas de análise (azul variação)
  ANALYSIS: 'rd-blue-light',
};

// Mapeamento dos tipos de estatística para tokens de cor
export const STATS_TYPE_CONFIG = {
  RECOMMENDATIONS: {
    colorToken: STATS_COLOR_TOKENS.PRIMARY,
    semantics: 'Quantidade total de produtos recomendados',
  },

  AVERAGE_SCORE: {
    colorToken: STATS_COLOR_TOKENS.PERFORMANCE,
    semantics: 'Qualidade média das recomendações',
  },

  CATEGORIES: {
    colorToken: STATS_COLOR_TOKENS.SUCCESS,
    semantics: 'Diversidade de categorias encontradas',
  },

  MATCH_RATE: {
    colorToken: STATS_COLOR_TOKENS.ANALYSIS,
    semantics: 'Taxa de compatibilidade geral',
  },
};

// Função utilitária para obter configuração de cor por tipo
export const getStatsColorConfig = (statsType) => {
  return STATS_TYPE_CONFIG[statsType] || STATS_TYPE_CONFIG.PRIMARY;
};
