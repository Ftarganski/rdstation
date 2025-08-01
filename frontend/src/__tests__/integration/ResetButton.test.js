/**
 * Teste de integração para o botão Reset
 * Verifica se o botão limpa corretamente os campos e as recomendações
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../App';

// Mock completo do produto service
jest.mock('../../services/product.service.js', () => {
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

  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue(mockProducts),
  };
});

describe('Reset Button Integration Test', () => {
  test('deve limpar os campos do formulário e as recomendações ao clicar em Reset', async () => {
    render(<App />);

    // Aguardar o formulário carregar
    await waitFor(() => {
      expect(screen.getByTestId('recommendation-form')).toBeInTheDocument();
    });

    // Selecionar algumas preferências
    const preferencesCheckboxes = screen.getAllByRole('checkbox');
    if (preferencesCheckboxes.length > 0) {
      fireEvent.click(preferencesCheckboxes[0]);
      fireEvent.click(preferencesCheckboxes[1]);
    }

    // Selecionar um tipo de recomendação
    const radioButtons = screen.getAllByRole('radio');
    if (radioButtons.length > 0) {
      fireEvent.click(radioButtons[0]);
    }

    // Submeter o formulário (simular geração de recomendações)
    const submitButton = screen.getByRole('button', {
      name: /obter recomendações/i,
    });
    fireEvent.click(submitButton);

    // Verificar se as recomendações foram geradas
    await waitFor(
      () => {
        // Procurar por elementos que indicam que recomendações foram geradas
        const recommendationElements = screen.queryAllByText(/RD Station/i);
        expect(recommendationElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    // Clicar no botão Reset
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);

    // Verificar se os campos foram limpos
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    await waitFor(() => {
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).not.toBeChecked();
      });
    });

    // Verificar se as recomendações foram limpas
    await waitFor(() => {
      const recommendationElements = screen.queryAllByText(/RD Station/i);
      expect(recommendationElements.length).toBe(0);
    });
  });

  test('deve limpar apenas os campos sem submeter primeiro', async () => {
    render(<App />);

    // Aguardar o formulário carregar
    await waitFor(() => {
      expect(screen.getByTestId('recommendation-form')).toBeInTheDocument();
    });

    // Selecionar algumas opções
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[0]);
    }

    const radios = screen.getAllByRole('radio');
    if (radios.length > 0) {
      fireEvent.click(radios[0]);
    }

    // Verificar que as opções foram selecionadas
    expect(checkboxes[0]).toBeChecked();
    expect(radios[0]).toBeChecked();

    // Clicar no botão Reset
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);

    // Verificar se os campos foram limpos
    await waitFor(() => {
      expect(checkboxes[0]).not.toBeChecked();
    });

    await waitFor(() => {
      expect(radios[0]).not.toBeChecked();
    });
  });
});
