/**
 * Componente Modal de Detalhes do Produto
 * Exibe informações completas de um produto específico
 */

import { Modal } from "@/components";
import PropTypes from "prop-types";

/**
 * Componente de tag/badge reutilizável
 */
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-rd-gray-light text-rd-blue-dark",
    preference: "bg-rd-sky-light text-rd-blue-dark",
    feature: "bg-rd-cyan-light text-rd-blue-dark",
    category: "bg-rd-cyan-light text-rd-blue-dark",
  };

  return (
    <span
      className={`
        inline-block px-3 py-1 text-sm font-medium rounded-full
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

/**
 * Componente ProductModal
 */
const ProductModal = ({
  isOpen,
  onClose,
  product,
  "data-testid": testId = "product-modal",
}) => {
  if (!product) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      size="large"
      data-testid={testId}
    >
      <div className="space-y-6">
        {/* Categoria */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-rd-cyan"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-rd-blue-dark">
              Categoria
            </h3>
          </div>
          <Badge variant="category">{product.category}</Badge>
        </div>

        {/* Descrição (se disponível) */}
        {product.description && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-rd-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-rd-blue-dark">
                Descrição
              </h3>
            </div>
            <p className="text-rd-blue-dark leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Preferências */}
        {product.preferences && product.preferences.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-rd-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-rd-blue-dark">
                Preferências Atendidas
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.preferences.map((preference, index) => (
                <Badge key={index} variant="preference">
                  {preference}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Funcionalidades */}
        {product.features && product.features.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-rd-cyan"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-rd-blue-dark">
                Funcionalidades Principais
              </h3>
            </div>
            <div className="space-y-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-rd-cyan mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-rd-blue-dark">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="pt-4 border-t border-rd-gray">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-rd-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-rd-blue-dark">
              Informações Adicionais
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-rd-gray">ID do Produto:</span>
              <span className="ml-2 text-rd-blue-dark">{product.id}</span>
            </div>
            <div>
              <span className="font-medium text-rd-gray">Categoria:</span>
              <span className="ml-2 text-rd-blue-dark">{product.category}</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4 border-t border-rd-gray">
          <div className="bg-gradient-to-r from-rd-sky-light to-rd-cyan-light p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-rd-blue flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-rd-blue-dark mb-1">
                  Interessado em {product.name}?
                </h4>
                <p className="text-sm text-rd-blue-dark">
                  Entre em contato com nossa equipe para saber mais sobre este
                  produto e como ele pode atender às suas necessidades
                  específicas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// PropTypes
Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "preference", "feature", "category"]),
  className: PropTypes.string,
};

ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    preferences: PropTypes.arrayOf(PropTypes.string),
    features: PropTypes.arrayOf(PropTypes.string),
  }),
  "data-testid": PropTypes.string,
};

ProductModal.displayName = "ProductModal";

export default ProductModal;
