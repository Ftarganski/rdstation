/**
 * Componente Modal reutilizável
 * Segue princípios de acessibilidade e UX
 */

import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";
import { X } from 'lucide-react';

/**
 * Componente Modal
 * @param {Object} props - Propriedades do componente
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  "data-testid": testId = "modal",
}) => {
  // Handle escape key press
  const handleEscapeKey = useCallback(
    (event) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose, closeOnOverlayClick]
  );

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, handleEscapeKey]);

  // Don't render if not open
  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-7xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid={testId}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
        data-testid="modal-overlay"
      />

      {/* Modal Content */}
      <div
        className={`
          relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]}
          max-h-[90vh] flex flex-col
          transform transition-all duration-200 ease-out
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-rd-gray flex-shrink-0">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-rd-blue-dark"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-rd-gray hover:text-rd-blue-dark transition-colors p-1 rounded-full hover:bg-rd-gray-light"
                aria-label="Fechar modal"
                data-testid="modal-close-button"
              >
                <X
                  className="w-6 h-6"
                />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large", "full"]),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

Modal.displayName = "Modal";

export default Modal;
