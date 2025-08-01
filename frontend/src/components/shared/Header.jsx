/**
 * Componente Header fixo da aplicação
 * Contém logo, título e descrição do sistema
 */

import PropTypes from "prop-types";
import { memo } from "react";
import ThemeSwitch from "./ThemeSwitch";

/**
 * Header principal da aplicação
 * @param {Object} props - Propriedades do componente
 */
const Header = memo(
  ({
    title = "Recomendador de Produtos RD Station",
    description = "Descubra quais soluções da RD Station são ideais para o seu negócio.",
    logoSrc = "/logo.svg",
    logoAlt = "RD Station Logo",
    className = "",
    "data-testid": testId = "app-header",
  }) => {
    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-rd-cyan-light border-b border-rd-cyan shadow-sm ${className}`}
        data-testid={testId}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src={logoSrc}
                alt={logoAlt}
                className="h-12 w-auto"
                loading="eager"
              />
            </div>

            {/* Título e Descrição */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-center text-rd-blue-dark mb-1 truncate">
                {title}
              </h1>
              <p className="text-sm lg:text-base text-rd-blue-dark text-center opacity-80 leading-tight">
                {description}
              </p>
            </div>

            {/* Theme Switch */}
            <div className="flex-shrink-0">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";

Header.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  logoSrc: PropTypes.string,
  logoAlt: PropTypes.string,
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

export default Header;
