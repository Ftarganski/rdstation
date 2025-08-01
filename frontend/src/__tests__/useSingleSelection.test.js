/**
 * Testes para o hook useSingleSelection
 * Verifica funcionalidades de seleção simples (radio buttons)
 */

import { act, renderHook } from '@testing-library/react';
import useSingleSelection from '../hooks/useSingleSelection';

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

describe('useSingleSelection Hook', () => {
  test('deve inicializar com valor padrão null', () => {
    const { result } = renderHook(() => useSingleSelection());

    expect(result.current.selectedValue).toBe(null);
    expect(result.current.hasSelection).toBe(false);
    expect(typeof result.current.selectValue).toBe('function');
    expect(typeof result.current.clearSelection).toBe('function');
    expect(typeof result.current.isSelected).toBe('function');
  });

  test('deve inicializar com valor inicial fornecido', () => {
    const initialValue = 'SingleProduct';
    const { result } = renderHook(() => useSingleSelection(initialValue));

    expect(result.current.selectedValue).toBe(initialValue);
    expect(result.current.hasSelection).toBe(true);
    expect(result.current.isSelected(initialValue)).toBe(true);
  });

  test('deve selecionar um novo valor', () => {
    const { result } = renderHook(() => useSingleSelection());

    const newValue = 'MultipleProducts';

    act(() => {
      result.current.selectValue(newValue);
    });

    expect(result.current.selectedValue).toBe(newValue);
    expect(result.current.hasSelection).toBe(true);
    expect(result.current.isSelected(newValue)).toBe(true);
  });

  test('deve substituir valor anterior ao selecionar novo valor', () => {
    const initialValue = 'SingleProduct';
    const { result } = renderHook(() => useSingleSelection(initialValue));

    expect(result.current.selectedValue).toBe(initialValue);

    const newValue = 'MultipleProducts';

    act(() => {
      result.current.selectValue(newValue);
    });

    expect(result.current.selectedValue).toBe(newValue);
    expect(result.current.isSelected(initialValue)).toBe(false);
    expect(result.current.isSelected(newValue)).toBe(true);
  });

  test('deve limpar a seleção', () => {
    const initialValue = 'SingleProduct';
    const { result } = renderHook(() => useSingleSelection(initialValue));

    expect(result.current.hasSelection).toBe(true);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedValue).toBe(null);
    expect(result.current.hasSelection).toBe(false);
    expect(result.current.isSelected(initialValue)).toBe(false);
  });

  test('deve verificar se um valor está selecionado', () => {
    const selectedValue = 'SingleProduct';
    const otherValue = 'MultipleProducts';

    const { result } = renderHook(() => useSingleSelection(selectedValue));

    expect(result.current.isSelected(selectedValue)).toBe(true);
    expect(result.current.isSelected(otherValue)).toBe(false);
    expect(result.current.isSelected(null)).toBe(false);
  });

  test('deve permitir seleção com diferentes tipos de dados', () => {
    const { result } = renderHook(() => useSingleSelection());

    // Teste com string
    act(() => {
      result.current.selectValue('string-value');
    });
    expect(result.current.selectedValue).toBe('string-value');

    // Teste com número
    act(() => {
      result.current.selectValue(42);
    });
    expect(result.current.selectedValue).toBe(42);

    // Teste com objeto
    const objectValue = { id: 1, name: 'Produto' };
    act(() => {
      result.current.selectValue(objectValue);
    });
    expect(result.current.selectedValue).toBe(objectValue);

    // Teste com booleano
    act(() => {
      result.current.selectValue(true);
    });
    expect(result.current.selectedValue).toBe(true);
  });

  test('deve atualizar quando o valor inicial muda (reset funcional)', () => {
    const initialValue = 'SingleProduct';
    const { result, rerender } = renderHook(
      ({ initialValue }) => useSingleSelection(initialValue),
      { initialProps: { initialValue } }
    );

    expect(result.current.selectedValue).toBe(initialValue);

    // Simular mudança do valor inicial (como em um reset)
    const newInitialValue = 'MultipleProducts';
    rerender({ initialValue: newInitialValue });

    expect(result.current.selectedValue).toBe(newInitialValue);
    expect(result.current.isSelected(newInitialValue)).toBe(true);
    expect(result.current.isSelected(initialValue)).toBe(false);
  });

  test('deve atualizar para null quando valor inicial muda para null (reset completo)', () => {
    const initialValue = 'SingleProduct';
    const { result, rerender } = renderHook(
      ({ initialValue }) => useSingleSelection(initialValue),
      { initialProps: { initialValue } }
    );

    expect(result.current.hasSelection).toBe(true);

    // Simular reset completo
    rerender({ initialValue: null });

    expect(result.current.selectedValue).toBe(null);
    expect(result.current.hasSelection).toBe(false);
    expect(result.current.isSelected(initialValue)).toBe(false);
  });

  test('deve manter referência de função estável para callbacks', () => {
    const { result, rerender } = renderHook(() => useSingleSelection());

    const initialSelectValue = result.current.selectValue;
    const initialClearSelection = result.current.clearSelection;

    // Forçar re-render
    rerender();

    expect(result.current.selectValue).toBe(initialSelectValue);
    expect(result.current.clearSelection).toBe(initialClearSelection);
    // isSelected muda porque depende do selectedValue
    expect(typeof result.current.isSelected).toBe('function');
  });

  test('deve lidar com valores undefined e null corretamente', () => {
    const { result } = renderHook(() => useSingleSelection());

    // Teste com undefined
    act(() => {
      result.current.selectValue(undefined);
    });
    expect(result.current.selectedValue).toBe(undefined);
    expect(result.current.hasSelection).toBe(false); // undefined != null

    // Teste com null
    act(() => {
      result.current.selectValue(null);
    });
    expect(result.current.selectedValue).toBe(null);
    expect(result.current.hasSelection).toBe(false);

    // Teste com zero (falsy mas válido)
    act(() => {
      result.current.selectValue(0);
    });
    expect(result.current.selectedValue).toBe(0);
    expect(result.current.hasSelection).toBe(true);

    // Teste com string vazia (falsy mas válido)
    act(() => {
      result.current.selectValue('');
    });
    expect(result.current.selectedValue).toBe('');
    expect(result.current.hasSelection).toBe(true);
  });

  test('deve permitir múltiplas chamadas de selectValue em sequência', () => {
    const { result } = renderHook(() => useSingleSelection());

    const valores = ['valor1', 'valor2', 'valor3'];

    valores.forEach((valor) => {
      act(() => {
        result.current.selectValue(valor);
      });
      expect(result.current.selectedValue).toBe(valor);
    });

    // Apenas o último valor deve estar selecionado
    expect(result.current.selectedValue).toBe('valor3');
    expect(result.current.isSelected('valor1')).toBe(false);
    expect(result.current.isSelected('valor2')).toBe(false);
    expect(result.current.isSelected('valor3')).toBe(true);
  });
});
