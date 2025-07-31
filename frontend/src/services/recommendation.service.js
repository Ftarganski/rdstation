const getRecommendations = (
  formData = {
    selectedPreferences: [],
    selectedFeatures: [],
    recommendationType: 'SingleProduct',
  },
  products = []
) => {
  const {
    selectedPreferences,
    selectedFeatures,
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

  // filtra score>0 e ordena asc
  const sorted = scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => a.score - b.score || a.product.id - b.product.id);

  if (isSingle) {
    return sorted.length > 0 ? [sorted[sorted.length - 1].product] : [];
  }
  return sorted.map((entry) => entry.product);
};

const recommendationService = { getRecommendations };
export default recommendationService;
