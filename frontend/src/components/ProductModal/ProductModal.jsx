/**
 * Componente Modal de Detalhes do Produto
 * Exibe informações completas de um produto específico
 */

import { Modal } from "@/components";
import {
  Check,
  CheckCircle,
  FileText,
  Info,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";
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
            <Tag className="w-5 h-5 text-rd-cyan" />
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
              <FileText className="w-5 h-5 text-rd-gray" />
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
              <Star className="w-5 h-5 text-rd-blue" />
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
              <CheckCircle className="w-5 h-5 text-rd-cyan" />
              <h3 className="text-lg font-semibold text-rd-blue-dark">
                Funcionalidades Principais
              </h3>
            </div>
            <div className="space-y-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-rd-cyan mt-0.5 flex-shrink-0" />
                  <span className="text-rd-blue-dark">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="pt-4 border-t border-rd-gray">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-rd-gray" />
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
          <div className="bg-gradient-to-r from-rd-sky-light to-rd-cyan-light p-4 rounded-lg flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-rd-blue flex-shrink-0" />
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
