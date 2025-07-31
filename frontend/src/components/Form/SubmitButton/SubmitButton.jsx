/**
 * Componente SubmitButton refatorado
 * Segue princípios de extensibilidade e acessibilidade
 * Suporte a estados de loading e disabled
 */

import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Componente de botão de submit para formulários
 * @param {Object} props - Propriedades do componente
 */
const SubmitButton = memo(
  ({
    text = "Enviar",
    isLoading = false,
    disabled = false,
    variant = "primary",
    size = "medium",
    className = "",
    onClick,
    "data-testid": testId = "submit-button",
    ...props
  }) => {
    const baseClasses =
      "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300",
      secondary:
        "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 disabled:bg-gray-300",
      success:
        "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-green-300",
      danger:
        "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-300",
    };

    const sizeClasses = {
      small: "py-2 px-3 text-sm",
      medium: "py-3 px-6 text-base",
      large: "py-4 px-8 text-lg",
    };

    const isDisabled = disabled || isLoading;

    const handleClick = (event) => {
      if (!isDisabled && onClick) {
        onClick(event);
      }
    };

    return (
      <button
        type="submit"
        disabled={isDisabled}
        onClick={handleClick}
        className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${className}
      `}
        data-testid={testId}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading && (
            <div
              className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
              aria-hidden="true"
            />
          )}
          <span>{text}</span>
        </div>
      </button>
    );
  }
);

SubmitButton.propTypes = {
  text: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  "data-testid": PropTypes.string,
};

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
