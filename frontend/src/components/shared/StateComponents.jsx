/**
 * Componentes para estados de loading e erro
 * Segue o princípio DRY e SRP
 * Componentes reutilizáveis em toda a aplicação
 */

import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Componente para exibição de loading
 * @param {Object} props - Propriedades do componente
 */
export const LoadingState = memo(
  ({
    message = "Carregando...",
    size = "medium",
    className = "",
    showSpinner = true,
    "data-testid": testId = "loading-state",
  }) => {
    const sizeClasses = {
      small: "h-4 w-4",
      medium: "h-8 w-8",
      large: "h-12 w-12",
    };

    const textSizeClasses = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    };

    return (
      <div
        className={`flex flex-col items-center justify-center py-8 ${className}`}
        data-testid={testId}
      >
        {showSpinner && (
          <div
            className={`animate-spin rounded-full border-b-2 border-rd-blue mb-4 ${sizeClasses[size]}`}
            aria-hidden="true"
          />
        )}
        <p className={`text-rd-gray text-center ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    );
  }
);

/**
 * Componente para exibição de erro
 * @param {Object} props - Propriedades do componente
 */
export const ErrorState = memo(
  ({
    title = "Ops! Algo deu errado",
    message = "Ocorreu um erro inesperado. Tente novamente.",
    onRetry,
    retryText = "Tentar novamente",
    className = "",
    variant = "error",
    "data-testid": testId = "error-state",
  }) => {
    const variantClasses = {
      error: {
        container: "bg-red-50 border-red-200 text-red-800",
        title: "text-red-800",
        message: "text-red-600",
        button: "bg-red-600 hover:bg-red-700 text-white",
      },
      warning: {
        container: "bg-yellow-50 border-yellow-200 text-yellow-800",
        title: "text-yellow-800",
        message: "text-yellow-600",
        button: "bg-yellow-600 hover:bg-yellow-700 text-white",
      },
      info: {
        container: "bg-rd-sky-light border-rd-blue text-rd-blue-dark",
        title: "text-rd-blue-dark",
        message: "text-rd-blue",
        button: "bg-rd-blue hover:bg-rd-blue-dark text-rd-white",
      },
    };

    const styles = variantClasses[variant];

    return (
      <div
        className={`p-6 rounded-lg border ${styles.container} ${className}`}
        data-testid={testId}
      >
        <div className="text-center">
          <h3 className={`text-lg font-semibold mb-2 ${styles.title}`}>
            {title}
          </h3>
          <p className={`mb-4 ${styles.message}`}>{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`px-4 py-2 rounded font-medium transition-colors ${styles.button}`}
              data-testid="retry-button"
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }
);

/**
 * Componente para estado vazio
 * @param {Object} props - Propriedades do componente
 */
export const EmptyState = memo(
  ({
    title = "Nenhum item encontrado",
    message = "Não há dados para exibir no momento.",
    icon,
    action,
    className = "",
    "data-testid": testId = "empty-state",
  }) => {
    return (
      <div className={`text-center py-12 ${className}`} data-testid={testId}>
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <h3 className="text-lg font-medium text-rd-blue-dark mb-2">{title}</h3>
        <p className="text-rd-gray mb-6">{message}</p>
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    );
  }
);

// PropTypes
LoadingState.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
  showSpinner: PropTypes.bool,
  "data-testid": PropTypes.string,
};

ErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  retryText: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["error", "warning", "info"]),
  "data-testid": PropTypes.string,
};

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

// Display names
LoadingState.displayName = "LoadingState";
ErrorState.displayName = "ErrorState";
EmptyState.displayName = "EmptyState";
