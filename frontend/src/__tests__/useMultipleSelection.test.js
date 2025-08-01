/**
 * Testes para o hook useMultipleSelection
 * Verifica funcionalidades de seleção múltipla (checkboxes)
 */

import { act, renderHook } from '@testing-library/react';
import useMultipleSelection from '../hooks/useMultipleSelection';

// Suprimir console.error e console.warn durante os testes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

describe('useMultipleSelection Hook', () => {
  test('deve inicializar com array vazio por padrão', () => {
    const { result } = renderHook(() => useMultipleSelection());

    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.hasSelection).toBe(false);
    expect(result.current.selectionCount).toBe(0);
    expect(typeof result.current.toggleSelection).toBe('function');
    expect(typeof result.current.addSelection).toBe('function');
    expect(typeof result.current.removeSelection).toBe('function');
    expect(typeof result.current.clearSelection).toBe('function');
    expect(typeof result.current.setSelection).toBe('function');
    expect(typeof result.current.isSelected).toBe('function');
  });

  test('deve inicializar com itens iniciais fornecidos', () => {
    const initialItems = ['item1', 'item2'];
    const { result } = renderHook(() => useMultipleSelection(initialItems));

    expect(result.current.selectedItems).toEqual(initialItems);
    expect(result.current.hasSelection).toBe(true);
    expect(result.current.selectionCount).toBe(2);
    expect(result.current.isSelected('item1')).toBe(true);
    expect(result.current.isSelected('item2')).toBe(true);
  });

  test('deve ignorar remoção de item não selecionado', () => {
    const initialItems = ['item1', 'item2'];
    const { result } = renderHook(() => useMultipleSelection(initialItems));

    const originalItems = [...result.current.selectedItems];

    // Tentar remover item que não existe
    act(() => {
      result.current.removeSelection('item-inexistente');
    });

    expect(result.current.selectedItems).toEqual(originalItems);
    expect(result.current.selectionCount).toBe(2);
  });

  test('deve limpar toda a seleção', () => {
    const initialItems = ['item1', 'item2', 'item3'];
    const { result } = renderHook(() => useMultipleSelection(initialItems));

    expect(result.current.hasSelection).toBe(true);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.hasSelection).toBe(false);
    expect(result.current.selectionCount).toBe(0);
    expect(result.current.isSelected('item1')).toBe(false);
  });

  test('deve verificar se item está selecionado', () => {
    const initialItems = ['item1', 'item3'];
    const { result } = renderHook(() => useMultipleSelection(initialItems));

    expect(result.current.isSelected('item1')).toBe(true);
    expect(result.current.isSelected('item2')).toBe(false);
    expect(result.current.isSelected('item3')).toBe(true);
    expect(result.current.isSelected('item-inexistente')).toBe(false);
  });
});
