/**
 * Testes para o hook useForm
 * Verifica funcionalidades de gerenciamento de estado do formulário
 */

import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import useForm from '../../hooks/useForm';

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

describe('useForm Hook', () => {
  test('deve inicializar com estado padrão quando não há estado inicial', () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.formData).toEqual({});
    expect(typeof result.current.updateFormField).toBe('function');
    expect(typeof result.current.resetForm).toBe('function');
    expect(typeof result.current.setFormData).toBe('function');
  });

  test('deve inicializar com estado inicial fornecido', () => {
    const initialState = {
      selectedPreferences: ['Pref1', 'Pref2'],
      selectedFeatures: ['Feature1'],
      selectedRecommendationType: 'SingleProduct',
    };

    const { result } = renderHook(() => useForm(initialState));

    expect(result.current.formData).toEqual(initialState);
  });

  test('deve atualizar campo específico sem afetar outros campos', () => {
    const initialState = {
      selectedPreferences: ['Pref1'],
      selectedFeatures: ['Feature1'],
      selectedRecommendationType: 'SingleProduct',
    };

    const { result } = renderHook(() => useForm(initialState));

    act(() => {
      result.current.updateFormField('selectedPreferences', ['Pref1', 'Pref2']);
    });

    expect(result.current.formData.selectedPreferences).toEqual([
      'Pref1',
      'Pref2',
    ]);
    expect(result.current.formData.selectedFeatures).toEqual(['Feature1']);
    expect(result.current.formData.selectedRecommendationType).toBe(
      'SingleProduct'
    );
  });

  test('deve adicionar novo campo quando não existe', () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.updateFormField('novoCampo', 'valor');
    });

    expect(result.current.formData.novoCampo).toBe('valor');
  });

  test('deve substituir completamente o valor de um array', () => {
    const initialState = {
      selectedPreferences: ['Pref1', 'Pref2'],
    };

    const { result } = renderHook(() => useForm(initialState));

    act(() => {
      result.current.updateFormField('selectedPreferences', [
        'NovaPreferencia',
      ]);
    });

    expect(result.current.formData.selectedPreferences).toEqual([
      'NovaPreferencia',
    ]);
  });

  test('deve resetar formulário para estado inicial', () => {
    const initialState = {
      selectedPreferences: ['Pref1'],
      selectedFeatures: ['Feature1'],
      selectedRecommendationType: 'SingleProduct',
    };

    const { result } = renderHook(() => useForm(initialState));

    // Modificar alguns campos
    act(() => {
      result.current.updateFormField('selectedPreferences', ['Pref1', 'Pref2']);
      result.current.updateFormField(
        'selectedRecommendationType',
        'MultipleProducts'
      );
    });

    // Verificar que foi modificado
    expect(result.current.formData.selectedPreferences).toEqual([
      'Pref1',
      'Pref2',
    ]);
    expect(result.current.formData.selectedRecommendationType).toBe(
      'MultipleProducts'
    );

    // Resetar
    act(() => {
      result.current.resetForm();
    });

    // Verificar que voltou ao estado inicial
    expect(result.current.formData).toEqual(initialState);
  });

  test('deve resetar para objeto vazio quando estado inicial é vazio', () => {
    const { result } = renderHook(() => useForm());

    // Adicionar alguns dados
    act(() => {
      result.current.updateFormField('campo1', 'valor1');
      result.current.updateFormField('campo2', 'valor2');
    });

    expect(result.current.formData).toEqual({
      campo1: 'valor1',
      campo2: 'valor2',
    });

    // Resetar
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({});
  });

  test('deve permitir definir todo o estado do formulário com setFormData', () => {
    const initialState = { campo1: 'valor1' };
    const { result } = renderHook(() => useForm(initialState));

    const newFormData = {
      selectedPreferences: ['Pref1', 'Pref2'],
      selectedFeatures: ['Feature1'],
      selectedRecommendationType: 'MultipleProducts',
    };

    act(() => {
      result.current.setFormData(newFormData);
    });

    expect(result.current.formData).toEqual(newFormData);
  });

  test('deve manter referência de função estável para updateFormField', () => {
    const { result, rerender } = renderHook(() => useForm());

    const firstRender = result.current.updateFormField;

    rerender();

    const secondRender = result.current.updateFormField;

    expect(firstRender).toBe(secondRender);
  });

  test('deve manter referência de função estável para resetForm', () => {
    const initialState = { campo: 'valor' };
    const { result, rerender } = renderHook(() => useForm(initialState));

    const firstRender = result.current.resetForm;

    rerender();

    const secondRender = result.current.resetForm;

    expect(firstRender).toBe(secondRender);
  });

  test('deve permitir valores de diferentes tipos', () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.updateFormField('string', 'texto');
      result.current.updateFormField('number', 42);
      result.current.updateFormField('boolean', true);
      result.current.updateFormField('array', [1, 2, 3]);
      result.current.updateFormField('object', { key: 'value' });
      result.current.updateFormField('null', null);
      result.current.updateFormField('undefined', undefined);
    });

    expect(result.current.formData).toEqual({
      string: 'texto',
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      object: { key: 'value' },
      null: null,
      undefined: undefined,
    });
  });

  test('deve preservar imutabilidade ao atualizar campos', () => {
    const initialState = {
      preferences: ['Pref1'],
      metadata: { version: 1 },
    };

    const { result } = renderHook(() => useForm(initialState));

    const originalFormData = result.current.formData;

    act(() => {
      result.current.updateFormField('preferences', ['Pref1', 'Pref2']);
    });

    // Verificar que o objeto original não foi mutado
    expect(originalFormData).toEqual(initialState);
    expect(result.current.formData).not.toBe(originalFormData);
    expect(result.current.formData.preferences).toEqual(['Pref1', 'Pref2']);
    expect(result.current.formData.metadata).toBe(originalFormData.metadata);
  });
});
