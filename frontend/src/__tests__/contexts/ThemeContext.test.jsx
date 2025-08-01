/**
 * Testes para o ThemeContext
 * Verifica funcionalidade do gerenciamento de temas
 */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  ThemeProvider,
  THEMES,
  useTheme,
} from "../../../contexts/ThemeContext";

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock do matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("ThemeContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document classes
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
  });

  test("deve fornecer tema light como padrão", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe(THEMES.LIGHT);
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
  });

  test("deve carregar tema salvo do localStorage", () => {
    localStorageMock.getItem.mockReturnValue(THEMES.DARK);

    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe(THEMES.DARK);
    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);
  });

  test("deve alternar tema corretamente", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Inicia como light
    expect(result.current.theme).toBe(THEMES.LIGHT);

    // Alterna para dark
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(THEMES.DARK);
    expect(result.current.isDark).toBe(true);

    // Alterna de volta para light
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(THEMES.LIGHT);
    expect(result.current.isLight).toBe(true);
  });

  test("deve definir tema específico", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Define tema dark especificamente
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });

    expect(result.current.theme).toBe(THEMES.DARK);

    // Define tema light especificamente
    act(() => {
      result.current.setTheme(THEMES.LIGHT);
    });

    expect(result.current.theme).toBe(THEMES.LIGHT);
  });

  test("deve ignorar temas inválidos", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    const { result } = renderHook(() => useTheme(), { wrapper });

    const initialTheme = result.current.theme;

    // Tenta definir tema inválido
    act(() => {
      result.current.setTheme("invalid-theme");
    });

    // Tema deve permanecer inalterado
    expect(result.current.theme).toBe(initialTheme);
  });

  test("deve salvar tema no localStorage", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Alterna tema
    act(() => {
      result.current.toggleTheme();
    });

    // Verifica se foi salvo no localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "rd-station-theme",
      THEMES.DARK
    );
  });

  test("deve aplicar classes CSS no documento", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Alterna para dark
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });

    // Verifica se a classe foi aplicada
    expect(document.documentElement.classList.contains(THEMES.DARK)).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      THEMES.DARK
    );

    // Alterna para light
    act(() => {
      result.current.setTheme(THEMES.LIGHT);
    });

    // Verifica se a classe foi aplicada
    expect(document.documentElement.classList.contains(THEMES.LIGHT)).toBe(
      true
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      THEMES.LIGHT
    );
  });

  test("deve lançar erro quando usado fora do Provider", () => {
    // Suprimir console.error para o teste
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme deve ser usado dentro de um ThemeProvider");

    consoleSpy.mockRestore();
  });
});
