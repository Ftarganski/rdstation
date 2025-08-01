/**
 * Context para gerenciamento de temas (light/dark)
 * Persiste preferências no localStorage
 */

import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";

// Constantes dos temas
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// Chave para localStorage
const THEME_STORAGE_KEY = "rd-station-theme";

// Criação do contexto
const ThemeContext = createContext();

/**
 * Hook personalizado para usar o contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};

/**
 * Detecta a preferência do sistema do usuário
 */
const getSystemTheme = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }
  return THEMES.LIGHT;
};

/**
 * Carrega o tema salvo no localStorage ou usa preferência do sistema
 */
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      return savedTheme;
    }
  }
  return getSystemTheme();
};

/**
 * Provider do contexto de tema
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  /**
   * Alterna entre temas light/dark
   */
  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
  };

  /**
   * Define um tema específico
   */
  const setSpecificTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  /**
   * Verifica se está no tema dark
   */
  const isDark = theme === THEMES.DARK;

  /**
   * Verifica se está no tema light
   */
  const isLight = theme === THEMES.LIGHT;

  // Persiste o tema no localStorage e aplica no documento
  useEffect(() => {
    // Salva no localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Aplica a classe no documento
    const root = document.documentElement;
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);
    root.classList.add(theme);

    // Define atributo data para CSS
    root.setAttribute("data-theme", theme);
  }, [theme]);

  // Escuta mudanças na preferência do sistema
  useEffect(() => {
    // Verifica se window.matchMedia está disponível (não está em testes)
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // Só atualiza se não há preferência salva
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const value = {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setTheme: setSpecificTheme,
    THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
