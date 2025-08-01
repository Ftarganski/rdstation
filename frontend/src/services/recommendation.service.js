const getRecommendations = (
  formData = {
    selectedPreferences: [],
    selectedFeatures: [],
    recommendationType: 'SingleProduct',
  },
  products = []
) => {
  const {
    selectedPreferences = [],
    selectedFeatures = [],
    recommendationType = 'SingleProduct',
  } = formData;

  // normaliza o type
  const type = recommendationType.trim().toLowerCase();
  const isSingle =
    type === 'singleproduct' ||
    type === 'produto único' ||
    type === 'produto unico';

  // calcula score
  const scored = products.map((product) => {
    const prefMatches = product.preferences.filter((pref) =>
      selectedPreferences.some(
        (sel) => sel.trim().toLowerCase() === pref.trim().toLowerCase()
      )
    ).length;

    const featMatches = product.features.filter((feat) =>
      selectedFeatures.some(
        (sel) => sel.trim().toLowerCase() === feat.trim().toLowerCase()
      )
    ).length;

    return { product, score: prefMatches + featMatches };
  });

  // filtra score>0 e ordena desc (maior score primeiro)
  // Em caso de empate, retorna o produto com ID mais alto (mais recente)
  const sorted = scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.product.id - a.product.id);

  if (isSingle) {
    return sorted.length > 0
      ? [{ ...sorted[0].product, score: sorted[0].score }]
      : [];
  }
  return sorted.map((entry) => ({ ...entry.product, score: entry.score }));
};

const recommendationService = { getRecommendations };
export default recommendationService;
