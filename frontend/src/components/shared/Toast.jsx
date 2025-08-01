/**
 * Componente Toast - Sistema de notificações elegante
 * Exibe mensagens de feedback para o usuário
 */

import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";

/**
 * Componente individual de toast
 */
const Toast = memo(
  ({
    id,
    type = "info",
    title,
    message,
    duration = 5000,
    onClose,
    autoClose = true,
    className = "",
    "data-testid": testId = "toast",
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
      // Animação de entrada
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      if (autoClose && duration > 0) {
        const timer = setTimeout(() => {
          setIsLeaving(true);
          setTimeout(() => {
            onClose?.(id);
          }, 300);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [autoClose, duration, id, onClose]);
    const handleClose = () => {
      setIsLeaving(true);
      setTimeout(() => {
        onClose?.(id);
      }, 300);
    };

    const variants = {
      success: {
        icon: CheckCircle,
        bgColor: "bg-green-50 border-green-200",
        iconColor: "text-green-500",
        titleColor: "text-green-800",
        messageColor: "text-green-700",
        closeColor: "text-green-400 hover:text-green-600",
      },
      error: {
        icon: XCircle,
        bgColor: "bg-red-50 border-red-200",
        iconColor: "text-red-500",
        titleColor: "text-red-800",
        messageColor: "text-red-700",
        closeColor: "text-red-400 hover:text-red-600",
      },
      warning: {
        icon: AlertCircle,
        bgColor: "bg-yellow-50 border-yellow-200",
        iconColor: "text-yellow-500",
        titleColor: "text-yellow-800",
        messageColor: "text-yellow-700",
        closeColor: "text-yellow-400 hover:text-yellow-600",
      },
      info: {
        icon: Info,
        bgColor: "bg-rd-sky-light border-rd-blue",
        iconColor: "text-rd-blue",
        titleColor: "text-rd-blue-dark",
        messageColor: "text-rd-blue",
        closeColor: "text-rd-blue hover:text-rd-blue-dark",
      },
    };

    const variant = variants[type];
    const Icon = variant.icon;

    return (
      <div
        className={`
          fixed right-4 top-20 z-50 max-w-sm w-full
          transform transition-all duration-300 ease-out
          ${
            isVisible && !isLeaving
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
          ${className}
        `}
        data-testid={testId}
      >
        <div
          className={`
            p-4 rounded-lg border shadow-lg notification-slide
            ${variant.bgColor}
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`w-5 h-5 ${variant.iconColor}`} />
            </div>

            <div className="ml-3 flex-1">
              {title && (
                <h4 className={`text-sm font-semibold ${variant.titleColor}`}>
                  {title}
                </h4>
              )}
              {message && (
                <p
                  className={`text-sm ${title ? "mt-1" : ""} ${
                    variant.messageColor
                  }`}
                >
                  {message}
                </p>
              )}
            </div>

            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleClose}
                className={`
                  inline-flex rounded-md p-1.5 transition-colors
                  ${variant.closeColor}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rd-blue
                `}
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar para autoClose */}
          {autoClose && duration > 0 && (
            <div className="mt-2">
              <div className="w-full bg-black bg-opacity-10 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all ease-linear ${
                    type === "success"
                      ? "bg-green-500"
                      : type === "error"
                      ? "bg-red-500"
                      : type === "warning"
                      ? "bg-yellow-500"
                      : "bg-rd-blue"
                  }`}
                  style={{
                    animation: `shrinkProgress ${duration}ms linear`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

/**
 * Container para múltiplos toasts
 */
const ToastContainer = memo(
  ({ toasts = [], onRemoveToast, className = "", ...props }) => {
    return (
      <div className={`fixed right-4 top-20 z-50 space-y-2 ${className}`}>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              transform: `translateY(${index * 10}px)`,
              zIndex: 50 - index,
            }}
          >
            <Toast {...toast} onClose={onRemoveToast} />
          </div>
        ))}
      </div>
    );
  }
);

// CSS adicional para a animação da progress bar
const style = document.createElement("style");
style.textContent = `
  @keyframes shrinkProgress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;
document.head.appendChild(style);

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  title: PropTypes.string,
  message: PropTypes.string,
  duration: PropTypes.number,
  onClose: PropTypes.func,
  autoClose: PropTypes.bool,
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

ToastContainer.propTypes = {
  toasts: PropTypes.array,
  onRemoveToast: PropTypes.func,
  className: PropTypes.string,
};

Toast.displayName = "Toast";
ToastContainer.displayName = "ToastContainer";

export { Toast, ToastContainer };
export default Toast;
