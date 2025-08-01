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
    description,
    size = "medium",
    variant = "default",
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

    const containerClasses = {
      default: "flex flex-col items-center justify-center py-8",
      app: "min-h-screen bg-rd-gray-light flex flex-col justify-center items-center",
    };

    return (
      <div
        className={`${containerClasses[variant]} ${className}`}
        data-testid={testId}
      >
        <div className="text-center max-w-md">
          {showSpinner && (
            <div
              className={`animate-spin rounded-full border-b-2 border-rd-blue mb-4 ${sizeClasses[size]}`}
              aria-hidden="true"
            />
          )}
          <p className={`text-rd-gray text-center ${textSizeClasses[size]}`}>
            {message}
          </p>
          {description && <p className="text-rd-gray mt-4">{description}</p>}
        </div>
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
    layout = "default",
    "data-testid": testId = "error-state",
  }) => {
    const variantClasses = {
      error: {
        container: "bg-rd-error border-rd-error text-rd-error",
        title: "text-rd-error",
        message: "text-rd-error",
        button: "bg-rd-error-solid hover:bg-rd-error-dark text-white",
      },
      warning: {
        container: "bg-rd-warning border-rd-warning text-rd-warning",
        title: "text-rd-warning",
        message: "text-rd-warning",
        button: "bg-rd-warning-solid hover:bg-rd-warning-dark text-white",
      },
      info: {
        container: "bg-rd-sky-light border-rd-blue text-rd-blue-dark",
        title: "text-rd-blue-dark",
        message: "text-rd-blue",
        button: "bg-rd-blue hover:bg-rd-blue-dark text-rd-white",
      },
    };

    const layoutClasses = {
      default: "",
      app: "min-h-screen bg-rd-gray-light flex flex-col justify-center items-center p-4",
    };

    const styles = variantClasses[variant];

    const content = (
      <div
        className={`p-6 rounded-lg border ${styles.container} ${
          layout === "app" ? "max-w-md w-full" : ""
        } ${className}`}
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

    if (layout === "app") {
      return <div className={layoutClasses.app}>{content}</div>;
    }

    return content;
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
  description: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["default", "app"]),
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
  layout: PropTypes.oneOf(["default", "app"]),
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
