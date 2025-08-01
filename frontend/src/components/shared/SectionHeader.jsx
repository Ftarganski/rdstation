/**
 * Componente de cabeçalho de seção reutilizável
 * Segue princípios DRY e SRP
 */

import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Componente de cabeçalho para seções
 * @param {Object} props - Propriedades do componente
 */
const SectionHeader = memo(
  ({
    title,
    description,
    children,
    className = "",
    titleClassName = "",
    descriptionClassName = "",
    "data-testid": testId = "section-header",
  }) => {
    return (
      <header
        className={`border-b border-rd-gray pb-4 mb-6 ${className}`}
        data-testid={testId}
      >
        <h2
          className={`text-2xl font-semibold text-rd-blue-dark mb-2 ${titleClassName}`}
        >
          {title}
        </h2>
        {description && (
          <p className={`text-rd-gray ${descriptionClassName}`}>
            {description}
          </p>
        )}
        {children}
      </header>
    );
  }
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
  "data-testid": PropTypes.string,
};

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
