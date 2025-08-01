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
        "bg-rd-blue hover:bg-rd-blue-dark text-rd-white focus:ring-rd-blue disabled:opacity-60",
      secondary:
        "bg-rd-gray hover:bg-rd-blue-dark text-rd-white focus:ring-rd-gray disabled:opacity-60",
      success:
        "bg-rd-cyan hover:bg-rd-blue text-rd-white focus:ring-rd-cyan disabled:opacity-60",
      danger:
        "bg-rd-error-solid hover:bg-rd-error-dark text-white focus:ring-rd-blue disabled:bg-rd-error-light",
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
