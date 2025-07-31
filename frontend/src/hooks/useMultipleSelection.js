/**
 * Hook genérico para seleção múltipla
 * Abstrai a lógica comum de seleção de múltiplos itens
 * Segue o princípio DRY ao reutilizar lógica comum
 */

import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gerenciar seleção múltipla de itens
 * @param {Array} initialSelected - Itens inicialmente selecionados
 * @returns {Object} Estado e ações para seleção múltipla
 */
const useMultipleSelection = (initialSelected = []) => {
  const [selectedItems, setSelectedItems] = useState(initialSelected);

  // Atualiza o estado quando initialSelected muda (importante para reset)
  useEffect(() => {
    setSelectedItems(initialSelected);
  }, [initialSelected]);

  /**
   * Toggle de seleção de um item
   * @param {*} item - Item a ser toggleado
   */
  const toggleSelection = useCallback((item) => {
    setSelectedItems((prevSelected) => {
      const isCurrentlySelected = prevSelected.includes(item);
      return isCurrentlySelected
        ? prevSelected.filter((selectedItem) => selectedItem !== item)
        : [...prevSelected, item];
    });
  }, []);

  /**
   * Adiciona um item à seleção
   * @param {*} item - Item a ser adicionado
   */
  const addSelection = useCallback((item) => {
    setSelectedItems((prevSelected) => {
      if (!prevSelected.includes(item)) {
        return [...prevSelected, item];
      }
      return prevSelected;
    });
  }, []);

  /**
   * Remove um item da seleção
   * @param {*} item - Item a ser removido
   */
  const removeSelection = useCallback((item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((selectedItem) => selectedItem !== item)
    );
  }, []);

  /**
   * Limpa toda a seleção
   */
  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  /**
   * Define nova seleção
   * @param {Array} newSelection - Nova seleção
   */
  const setSelection = useCallback((newSelection) => {
    setSelectedItems(Array.isArray(newSelection) ? newSelection : []);
  }, []);

  /**
   * Verifica se um item está selecionado
   * @param {*} item - Item a ser verificado
   * @returns {boolean}
   */
  const isSelected = useCallback(
    (item) => {
      return selectedItems.includes(item);
    },
    [selectedItems]
  );

  return {
    selectedItems,
    toggleSelection,
    addSelection,
    removeSelection,
    clearSelection,
    setSelection,
    isSelected,
    hasSelection: selectedItems.length > 0,
    selectionCount: selectedItems.length,
  };
};

export default useMultipleSelection;
