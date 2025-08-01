/**
 * Testes para o componente ProductModal
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductModal } from '../../../components';

describe('ProductModal', () => {
  const mockOnClose = vi.fn();
  const mockProduct = {
    id: 1,
    name: 'RD Station CRM',
    category: 'Vendas',
    description: 'Sistema completo de gestão de vendas',
    preferences: [
      'Integração fácil com ferramentas de e-mail',
      'Personalização de funis de vendas',
      'Relatórios avançados de desempenho de vendas',
    ],
    features: [
      'Gestão de leads e oportunidades',
      'Automação de fluxos de trabalho de vendas',
      'Rastreamento de interações com clientes',
    ],
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    product: mockProduct,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should render product modal when isOpen is true', () => {
    render(<ProductModal {...defaultProps} />);

    expect(screen.getByTestId('product-modal')).toBeInTheDocument();
    expect(screen.getByText('RD Station CRM')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(<ProductModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId('product-modal')).not.toBeInTheDocument();
  });

  it('should not render anything when product is null', () => {
    render(<ProductModal {...defaultProps} product={null} />);

    expect(screen.queryByTestId('product-modal')).not.toBeInTheDocument();
  });

  it('should display product category', () => {
    render(<ProductModal {...defaultProps} />);

    expect(screen.getByText('Categoria')).toBeInTheDocument();
    // Verifica se há pelo menos um elemento com o texto "Vendas" (pode haver múltiplos)
    expect(screen.getAllByText('Vendas')).toHaveLength(2); // Um no badge, outro na seção de informações
  });

  it('should display product description when available', () => {
    render(<ProductModal {...defaultProps} />);

    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(
      screen.getByText('Sistema completo de gestão de vendas')
    ).toBeInTheDocument();
  });

  it('should not display description section when description is not available', () => {
    const productWithoutDescription = { ...mockProduct };
    delete productWithoutDescription.description;

    render(
      <ProductModal {...defaultProps} product={productWithoutDescription} />
    );

    expect(screen.queryByText('Descrição')).not.toBeInTheDocument();
  });

  it('should display preferences when available', () => {
    render(<ProductModal {...defaultProps} />);

    expect(screen.getByText('Preferências Atendidas')).toBeInTheDocument();
    expect(
      screen.getByText('Integração fácil com ferramentas de e-mail')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Personalização de funis de vendas')
    ).toBeInTheDocument();
  });

  it('should display features when available', () => {
    render(<ProductModal {...defaultProps} />);

    expect(screen.getByText('Funcionalidades Principais')).toBeInTheDocument();
    expect(
      screen.getByText('Gestão de leads e oportunidades')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Automação de fluxos de trabalho de vendas')
    ).toBeInTheDocument();
  });

  it('should display product information section', () => {
    render(<ProductModal {...defaultProps} />);

    expect(screen.getByText('Informações Adicionais')).toBeInTheDocument();
    expect(screen.getByText('ID do Produto:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display call to action section', () => {
    render(<ProductModal {...defaultProps} />);

    expect(
      screen.getByText('Interessado em RD Station CRM?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Entre em contato com nossa equipe/)
    ).toBeInTheDocument();
  });

  it('should call onClose when modal is closed', () => {
    render(<ProductModal {...defaultProps} />);

    const closeButton = screen.getByLabelText('Fechar modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle product without preferences', () => {
    const productWithoutPreferences = { ...mockProduct };
    delete productWithoutPreferences.preferences;

    render(
      <ProductModal {...defaultProps} product={productWithoutPreferences} />
    );

    expect(
      screen.queryByText('Preferências Atendidas')
    ).not.toBeInTheDocument();
  });

  it('should handle product without features', () => {
    const productWithoutFeatures = { ...mockProduct };
    delete productWithoutFeatures.features;

    render(<ProductModal {...defaultProps} product={productWithoutFeatures} />);

    expect(
      screen.queryByText('Funcionalidades Principais')
    ).not.toBeInTheDocument();
  });
});
