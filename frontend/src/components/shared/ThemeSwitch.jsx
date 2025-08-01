/**
 * Componente Switch para alternar entre temas light/dark
 * Com ícones de Sol e Lua
 */

import { Moon, Sun } from "lucide-react";
import PropTypes from "prop-types";
import { memo } from "react";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Switch para mudança de tema
 */
const ThemeSwitch = memo(
  ({ size = 20, className = "", "data-testid": testId = "theme-switch" }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`
          relative inline-flex items-center justify-center
          w-14 h-8 rounded-full transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-rd-blue focus:ring-offset-2
          ${
            isDark
              ? "bg-rd-blue-dark hover:bg-rd-blue"
              : "bg-rd-cyan hover:bg-rd-blue"
          }
          ${className}
        `}
        aria-label={`Mudar para tema ${isDark ? "claro" : "escuro"}`}
        data-testid={testId}
      >
        {/* Track do switch */}
        <span
          className={`
            absolute inset-0 rounded-full transition-all duration-300
            ${isDark ? "bg-rd-blue-dark" : "bg-rd-cyan"}
          `}
        />

        {/* Círculo deslizante */}
        <span
          className={`
            relative z-10 inline-flex items-center justify-center
            w-6 h-6 rounded-full bg-white shadow-lg
            transform transition-transform duration-300 ease-in-out
            ${isDark ? "translate-x-3" : "-translate-x-3"}
          `}
        >
          {/* Ícone */}
          {isDark ? (
            <Moon
              size={size * 0.7}
              className="text-rd-blue-dark"
              aria-hidden="true"
            />
          ) : (
            <Sun
              size={size * 0.7}
              className="text-rd-cyan"
              aria-hidden="true"
            />
          )}
        </span>

        {/* Texto assistivo para screen readers */}
        <span className="visually-hidden">
          {isDark ? "Ativar tema claro" : "Ativar tema escuro"}
        </span>
      </button>
    );
  }
);

ThemeSwitch.displayName = "ThemeSwitch";

ThemeSwitch.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

export default ThemeSwitch;
