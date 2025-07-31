import { useEffect, useState } from 'react';
import getProducts from '../services/product.service';

/**
 * Hook para buscar produtos e extrair preferências e funcionalidades.
 */
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);

        const allPrefs = [];
        const allFeats = [];

        data.forEach((product) => {
          const prefs = product.preferences
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
          const feats = product.features
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);

          allPrefs.push(...prefs);
          allFeats.push(...feats);
        });

        setPreferences(allPrefs);
        setFeatures(allFeats);
      } catch (error) {
        console.error('Erro ao obter produtos:', error);
      }
    };

    fetchData();
  }, []);

  return { products, preferences, features };
};

export default useProducts;
