/**
 * Testes para o hook useProductModal
 * Verifica funcionalidades de gerenciamento do modal de produto
 */

import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useProductModal } from '../../hooks/useProductModal';

// Suprimir console.error e console.warn durante os testes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

describe('useProductModal Hook', () => {
  test('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useProductModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedProduct).toBe(null);
    expect(typeof result.current.openModal).toBe('function');
    expect(typeof result.current.closeModal).toBe('function');
  });

  test('deve abrir o modal com produto selecionado', () => {
    const { result } = renderHook(() => useProductModal());
    const mockProduct = {
      id: 1,
      name: 'Produto Teste',
      category: 'Categoria Teste',
    };

    act(() => {
      result.current.openModal(mockProduct);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedProduct).toEqual(mockProduct);
  });

  test('deve fechar o modal e limpar produto selecionado', () => {
    const { result } = renderHook(() => useProductModal());
    const mockProduct = {
      id: 1,
      name: 'Produto Teste',
      category: 'Categoria Teste',
    };

    // Primeiro abrir o modal
    act(() => {
      result.current.openModal(mockProduct);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedProduct).toEqual(mockProduct);

    // Depois fechar o modal
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedProduct).toBe(null);
  });

  test('deve abrir modal com diferentes produtos', () => {
    const { result } = renderHook(() => useProductModal());
    const produto1 = { id: 1, name: 'Produto 1' };
    const produto2 = { id: 2, name: 'Produto 2' };

    // Abrir com primeiro produto
    act(() => {
      result.current.openModal(produto1);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedProduct).toEqual(produto1);

    // Abrir com segundo produto (substituir)
    act(() => {
      result.current.openModal(produto2);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedProduct).toEqual(produto2);
  });

  test('deve manter consistência entre openModal e closeModal', () => {
    const { result } = renderHook(() => useProductModal());
    const mockProduct = { id: 1, name: 'Produto Teste' };

    // Múltiplas operações
    act(() => {
      result.current.openModal(mockProduct);
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedProduct).toBe(null);

    act(() => {
      result.current.openModal(mockProduct);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedProduct).toEqual(mockProduct);
  });

  test('deve abrir modal mesmo com produto null', () => {
    const { result } = renderHook(() => useProductModal());

    act(() => {
      result.current.openModal(null);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedProduct).toBe(null);
  });
});
