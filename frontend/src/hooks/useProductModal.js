/**
 * Hook customizado para gerenciar modal de produto
 */

import { useCallback, useState } from 'react';

export const useProductModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /**
   * Abre o modal com o produto selecionado
   */
  const openModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  }, []);

  /**
   * Fecha o modal e limpa o produto selecionado
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedProduct(null);
  }, []);

  return {
    isOpen,
    selectedProduct,
    openModal,
    closeModal,
  };
};
