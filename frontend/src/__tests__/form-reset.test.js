/**
 * Teste unitário para funcionalidade de reset do formulário
 * Testa os hooks e componentes isoladamente
 */

import { act, renderHook } from '@testing-library/react';
import { useForm } from '../hooks/useForm';
import { useRecommendations } from '../hooks/useRecommendations';

// Mock dos produtos para os hooks
const mockProducts = [
  {
    id: 1,
    name: 'RD Station Marketing',
    category: 'Marketing',
    preferences: ['Automação de marketing', 'Criação de landing pages'],
    features: [
      'Automação de campanhas de marketing',
      'Landing pages otimizadas para conversão',
    ],
  },
  {
    id: 2,
    name: 'RD Station CRM',
    category: 'Vendas',
    preferences: [
      'Integração fácil com ferramentas de e-mail',
      'Personalização de funis de vendas',
    ],
    features: [
      'Gestão de leads e oportunidades',
      'Pipeline de vendas personalizável',
    ],
  },
];

describe('Funcionalidade de Reset do Formulário', () => {
  test('useForm - deve limpar todos os campos quando resetForm é chamado', () => {
    const { result } = renderHook(() => useForm());

    // Simular seleção de alguns campos
    act(() => {
      result.current.updateField('selectedPreferences', [
        'Automação de marketing',
      ]);
      result.current.updateField('selectedFeatures', [
        'Automação de campanhas de marketing',
      ]);
      result.current.updateField('selectedRecommendationType', 'SingleProduct');
    });

    // Verificar que os campos foram selecionados
    expect(result.current.formData.selectedPreferences).toEqual([
      'Automação de marketing',
    ]);
    expect(result.current.formData.selectedFeatures).toEqual([
      'Automação de campanhas de marketing',
    ]);
    expect(result.current.formData.selectedRecommendationType).toBe(
      'SingleProduct'
    );

    // Resetar o formulário
    act(() => {
      result.current.resetForm();
    });

    // Verificar que todos os campos foram limpos
    expect(result.current.formData.selectedPreferences).toEqual([]);
    expect(result.current.formData.selectedFeatures).toEqual([]);
    expect(result.current.formData.selectedRecommendationType).toBe('');
  });

  test('useRecommendations - deve limpar as recomendações quando clearRecommendations é chamado', () => {
    const { result } = renderHook(() => useRecommendations());

    // Simular geração de recomendações
    act(() => {
      const formData = {
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: ['Automação de campanhas de marketing'],
        selectedRecommendationType: 'SingleProduct',
      };
      result.current.generateRecommendations(formData, mockProducts);
    });

    // Verificar que as recomendações foram geradas
    expect(result.current.recommendations.length).toBeGreaterThan(0);

    // Limpar as recomendações
    act(() => {
      result.current.clearRecommendations();
    });

    // Verificar que as recomendações foram limpas
    expect(result.current.recommendations).toEqual([]);
  });

  test('Integração - useForm e useRecommendations funcionam juntos para reset completo', () => {
    const { result: formResult } = renderHook(() => useForm());
    const { result: recommendationsResult } = renderHook(() =>
      useRecommendations()
    );

    // Simular preenchimento do formulário
    act(() => {
      formResult.current.updateField('selectedPreferences', [
        'Automação de marketing',
      ]);
      formResult.current.updateField('selectedFeatures', [
        'Automação de campanhas de marketing',
      ]);
      formResult.current.updateField(
        'selectedRecommendationType',
        'SingleProduct'
      );
    });

    // Simular geração de recomendações
    act(() => {
      recommendationsResult.current.generateRecommendations(
        formResult.current.formData,
        mockProducts
      );
    });

    // Verificar estado preenchido
    expect(
      formResult.current.formData.selectedPreferences.length
    ).toBeGreaterThan(0);
    expect(
      recommendationsResult.current.recommendations.length
    ).toBeGreaterThan(0);

    // Simular reset completo (como seria feito na aplicação)
    act(() => {
      formResult.current.resetForm();
      recommendationsResult.current.clearRecommendations();
    });

    // Verificar reset completo
    expect(formResult.current.formData.selectedPreferences).toEqual([]);
    expect(formResult.current.formData.selectedFeatures).toEqual([]);
    expect(formResult.current.formData.selectedRecommendationType).toBe('');
    expect(recommendationsResult.current.recommendations).toEqual([]);
  });

  test('useForm - campos individuais podem ser atualizados e resetados', () => {
    const { result } = renderHook(() => useForm());

    // Testar atualização de preferências
    act(() => {
      result.current.updateField('selectedPreferences', ['Pref 1', 'Pref 2']);
    });
    expect(result.current.formData.selectedPreferences).toEqual([
      'Pref 1',
      'Pref 2',
    ]);

    // Testar atualização de features
    act(() => {
      result.current.updateField('selectedFeatures', ['Feature 1']);
    });
    expect(result.current.formData.selectedFeatures).toEqual(['Feature 1']);

    // Testar atualização de tipo de recomendação
    act(() => {
      result.current.updateField(
        'selectedRecommendationType',
        'MultipleProducts'
      );
    });
    expect(result.current.formData.selectedRecommendationType).toBe(
      'MultipleProducts'
    );

    // Reset e verificação
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.selectedPreferences).toEqual([]);
    expect(result.current.formData.selectedFeatures).toEqual([]);
    expect(result.current.formData.selectedRecommendationType).toBe('');
  });

  test('useRecommendations - deve manter estado consistente após múltiplos resets', () => {
    const { result } = renderHook(() => useRecommendations());

    // Gerar recomendações primeira vez
    act(() => {
      const formData = {
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: [],
        selectedRecommendationType: 'SingleProduct',
      };
      result.current.generateRecommendations(formData, mockProducts);
    });

    expect(result.current.recommendations.length).toBe(1);

    // Limpar
    act(() => {
      result.current.clearRecommendations();
    });

    expect(result.current.recommendations).toEqual([]);

    // Gerar recomendações segunda vez
    act(() => {
      const formData = {
        selectedPreferences: ['Integração fácil com ferramentas de e-mail'],
        selectedFeatures: [],
        selectedRecommendationType: 'SingleProduct',
      };
      result.current.generateRecommendations(formData, mockProducts);
    });

    expect(result.current.recommendations.length).toBe(1);
    expect(result.current.recommendations[0].name).toBe('RD Station CRM');

    // Limpar novamente
    act(() => {
      result.current.clearRecommendations();
    });

    expect(result.current.recommendations).toEqual([]);
  });
});
