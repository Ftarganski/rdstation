/**
 * Testes para o componente Header
 * Verifica renderização e propriedades do header fixo
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Header from "../../../components/shared/Header";

describe("Header", () => {
  test("deve renderizar com propriedades padrão", () => {
    render(<Header />);

    // Verificar se o título padrão está presente
    expect(
      screen.getByText("Recomendador de Produtos RD Station")
    ).toBeInTheDocument();

    // Verificar se a descrição padrão está presente
    expect(
      screen.getByText(
        "Descubra quais soluções da RD Station são ideais para o seu negócio."
      )
    ).toBeInTheDocument();

    // Verificar se o logo está presente
    const logo = screen.getByAltText("RD Station Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo.svg");
  });

  test("deve renderizar com propriedades customizadas", () => {
    const customTitle = "Título Customizado";
    const customDescription = "Descrição customizada do sistema";
    const customLogoSrc = "/custom-logo.svg";
    const customLogoAlt = "Logo Customizado";

    render(
      <Header
        title={customTitle}
        description={customDescription}
        logoSrc={customLogoSrc}
        logoAlt={customLogoAlt}
      />
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customDescription)).toBeInTheDocument();

    const logo = screen.getByAltText(customLogoAlt);
    expect(logo).toHaveAttribute("src", customLogoSrc);
  });

  test("deve aplicar classes CSS corretas", () => {
    render(<Header data-testid="custom-header" />);

    const header = screen.getByTestId("custom-header");
    expect(header).toHaveClass("fixed", "top-0", "left-0", "right-0", "z-50");
    expect(header).toHaveClass(
      "bg-rd-cyan-light",
      "border-b",
      "border-rd-cyan"
    );
  });

  test("deve aplicar className customizada", () => {
    const customClass = "custom-header-class";
    render(<Header className={customClass} />);

    const header = screen.getByTestId("app-header");
    expect(header).toHaveClass(customClass);
  });

  test("deve ter estrutura HTML correta", () => {
    render(<Header />);

    // Verificar se é um elemento header
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Verificar se o título é um h1
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();

    // Verificar se o logo tem loading="eager"
    const logo = screen.getByAltText("RD Station Logo");
    expect(logo).toHaveAttribute("loading", "eager");
  });

  test("deve ter acessibilidade adequada", () => {
    render(<Header />);

    // Verificar se o header tem role banner
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Verificar se o logo tem alt text apropriado
    const logo = screen.getByAltText("RD Station Logo");
    expect(logo).toBeInTheDocument();

    // Verificar se o título é um heading principal
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
  });
});
