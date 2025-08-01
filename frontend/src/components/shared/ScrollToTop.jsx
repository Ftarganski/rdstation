/**
 * Componente ScrollToTop - Botão flutuante para voltar ao topo da página
 * Aparece apenas quando o usuário rola a página para baixo
 */

import { useEffect, useState } from "react";

/**
 * Componente de botão flutuante para scroll ao topo
 */
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Controla a visibilidade do botão baseado no scroll
   */
  useEffect(() => {
    const toggleVisibility = () => {
      // Mostra o botão quando o usuário rola mais de 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Adiciona o listener de scroll
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup - remove o listener quando o componente for desmontado
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  /**
   * Função para rolar suavemente para o topo da página
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * Manipula o clique via teclado (Enter ou Space)
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
      type="button"
    >
      {/* Ícone de seta para cima */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 4L4 12H8V20H16V12H20L12 4Z" fill="currentColor" />
      </svg>
    </button>
  );
}

export default ScrollToTop;
