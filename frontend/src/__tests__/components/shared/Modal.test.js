/**
 * Testes para o componente Modal
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from '../../../components';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // Reset body overflow style
    document.body.style.overflow = 'unset';
  });

  it('should render modal when isOpen is true', () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should render title when provided', () => {
    const title = 'Test Modal Title';
    render(<Modal {...defaultProps} title={title} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} title="Test" />);

    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when escape key is pressed', () => {
    render(<Modal {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', () => {
    render(<Modal {...defaultProps} />);

    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  it('should not call onClose when modal content is clicked', () => {
    render(<Modal {...defaultProps} />);

    const modalContent = screen.getByText('Modal Content');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should not call onClose on overlay click when closeOnOverlayClick is false', () => {
    render(<Modal {...defaultProps} closeOnOverlayClick={false} />);

    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
  it('should not call onClose on escape when closeOnEscape is false', () => {
    render(<Modal {...defaultProps} closeOnEscape={false} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should apply correct size classes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="small" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-md');

    rerender(<Modal {...defaultProps} size="medium" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-2xl');

    rerender(<Modal {...defaultProps} size="large" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-4xl');

    rerender(<Modal {...defaultProps} size="full" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-7xl');
  });

  it('should prevent body scroll when modal is open', () => {
    render(<Modal {...defaultProps} />);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should not show close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} title="Test" showCloseButton={false} />);

    expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
  });
});
