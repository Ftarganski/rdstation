/**
 * Hook genérico para seleção simples (radio buttons)
 * Abstrai a lógica de seleção única
 * Segue o princípio SRP (Single Responsibility Principle)
 */

import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gerenciar seleção simples de um item
 * @param {*} initialValue - Valor inicialmente selecionado
 * @returns {Object} Estado e ações para seleção simples
 */
const useSingleSelection = (initialValue = null) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  // Atualiza o estado quando initialValue muda (importante para reset)
  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  /**
   * Seleciona um novo valor
   * @param {*} value - Valor a ser selecionado
   */
  const selectValue = useCallback((value) => {
    setSelectedValue(value);
  }, []);

  /**
   * Limpa a seleção
   */
  const clearSelection = useCallback(() => {
    setSelectedValue(null);
  }, []);

  /**
   * Verifica se um valor está selecionado
   * @param {*} value - Valor a ser verificado
   * @returns {boolean}
   */
  const isSelected = useCallback(
    (value) => {
      return selectedValue === value;
    },
    [selectedValue]
  );

  return {
    selectedValue,
    selectValue,
    clearSelection,
    isSelected,
    hasSelection: selectedValue != null,
  };
};

export default useSingleSelection;
