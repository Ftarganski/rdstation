/**
 * Testes para o componente ThemeSwitch
 * Verifica funcionalidade de mudança de tema
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ThemeSwitch from "../../../components/shared/ThemeSwitch";
import { ThemeProvider } from "../../../contexts/ThemeContext";

// Wrapper com ThemeProvider para os testes
const ThemeWrapper = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeSwitch", () => {
  test("deve renderizar com tema light por padrão", () => {
    render(
      <ThemeWrapper>
        <ThemeSwitch />
      </ThemeWrapper>
    );

    const button = screen.getByTestId("theme-switch");
    expect(button).toBeInTheDocument();

    // Deve mostrar ícone de Sol no tema light
    const sunIcon = screen.getByLabelText(/mudar para tema escuro/i);
    expect(sunIcon).toBeInTheDocument();
  });

  test("deve alternar entre temas ao clicar", () => {
    render(
      <ThemeWrapper>
        <ThemeSwitch />
      </ThemeWrapper>
    );

    const button = screen.getByTestId("theme-switch");

    // Inicialmente deve estar no tema light
    expect(
      screen.getByLabelText(/mudar para tema escuro/i)
    ).toBeInTheDocument();

    // Clicar para mudar para dark
    fireEvent.click(button);

    // Agora deve estar no tema dark
    expect(screen.getByLabelText(/mudar para tema claro/i)).toBeInTheDocument();

    // Clicar novamente para voltar ao light
    fireEvent.click(button);

    // Deve voltar ao tema light
    expect(
      screen.getByLabelText(/mudar para tema escuro/i)
    ).toBeInTheDocument();
  });

  test("deve aplicar classes CSS corretas baseadas no tema", () => {
    render(
      <ThemeWrapper>
        <ThemeSwitch />
      </ThemeWrapper>
    );

    const button = screen.getByTestId("theme-switch");

    // No tema light, deve ter classes específicas
    expect(button).toHaveClass("bg-rd-cyan");

    // Mudar para dark
    fireEvent.click(button);

    // No tema dark, deve ter classes diferentes
    expect(button).toHaveClass("bg-rd-blue-dark");
  });

  test("deve ter acessibilidade adequada", () => {
    render(
      <ThemeWrapper>
        <ThemeSwitch />
      </ThemeWrapper>
    );

    const button = screen.getByTestId("theme-switch");

    // Deve ser um botão
    expect(button).toHaveAttribute("type", "button");

    // Deve ter aria-label apropriado
    expect(button).toHaveAttribute("aria-label");

    // Deve ter texto assistivo para screen readers (aceita qualquer tema)
    const assistiveText = screen.getByText(/ativar tema/i);
    expect(assistiveText).toBeInTheDocument();
  });

  test("deve aplicar className customizada", () => {
    const customClass = "custom-switch-class";

    render(
      <ThemeWrapper>
        <ThemeSwitch className={customClass} />
      </ThemeWrapper>
    );

    const button = screen.getByTestId("theme-switch");
    expect(button).toHaveClass(customClass);
  });

  test("deve ter tamanho de ícone customizável", () => {
    render(
      <ThemeWrapper>
        <ThemeSwitch size={24} />
      </ThemeWrapper>
    );

    // Verifica se o componente renderiza corretamente com tamanho customizado
    const button = screen.getByTestId("theme-switch");
    expect(button).toBeInTheDocument();
  });

  test("deve funcionar com data-testid customizado", () => {
    const customTestId = "custom-theme-switch";

    render(
      <ThemeWrapper>
        <ThemeSwitch data-testid={customTestId} />
      </ThemeWrapper>
    );

    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });
});
