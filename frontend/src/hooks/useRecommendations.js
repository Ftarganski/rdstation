import { useCallback, useState } from 'react';
import recommendationService from '../services/recommendation.service';

/**
 * Hook para lógica de recomendação de produtos.
 * @param {Array} products - Lista de produtos.
 */
const useRecommendations = (products) => {
  const [recommendations, setRecommendations] = useState([]);

  const getRecommendations = useCallback(
    (formData) => recommendationService.getRecommendations(formData, products),
    [products]
  );

  return { recommendations, getRecommendations, setRecommendations };
};

export default useRecommendations;
