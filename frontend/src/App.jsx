/**
 * Componente principal da aplicação refatorado
 * Segue princípios SOLID, DRY e Clean Code
 * Separação clara de responsabilidades
 */

import {
  AdvancedFilters,
  ErrorState,
  Header,
  LoadingState,
  ProductModal,
  RecommendationForm,
  RecommendationList,
  ScrollToTop,
  StatsCards,
  ToastContainer,
} from "@/components";
import { ThemeProvider } from "@/contexts";
import { useProducts } from "@/hooks";
import { recommendationService } from "@/services";
import { useCallback, useEffect, useState } from "react";

/**
 * Componente principal da aplicação
 */
function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isProcessingRecommendations, setIsProcessingRecommendations] =
    useState(false);
  const [recommendationError, setRecommendationError] = useState(null);

  // Estados para o modal de produto
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estados para os novos componentes
  const [toasts, setToasts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minScore: 0,
    sortBy: "score",
    sortOrder: "desc",
  });

  const {
    products,
    isLoading: isLoadingProducts,
    hasError: hasProductsError,
    errorMessage: productsErrorMessage,
    refetchProducts,
  } = useProducts();

  // Funções utilitárias para toast
  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Função para filtrar recomendações (memoizada para performance)
  const applyFilters = useCallback((recommendations, filters) => {
    if (!recommendations || recommendations.length === 0) return [];

    let filtered = [...recommendations];

    // Filtro por busca textual
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (rec) =>
          rec.name?.toLowerCase().includes(searchTerm) ||
          rec.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por categoria
    if (filters.category && filters.category !== "") {
      filtered = filtered.filter((rec) => rec.category === filters.category);
    }

    // Filtro por score mínimo
    if (filters.minScore > 0) {
      filtered = filtered.filter((rec) => (rec.score || 0) >= filters.minScore);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "score":
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        case "category":
          aValue = a.category || "";
          bValue = b.category || "";
          break;
        default:
          aValue = a.score || 0;
          bValue = b.score || 0;
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, []);

  // Handler para mudança de filtros
  const handleFiltersChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      const filtered = applyFilters(recommendations, newFilters);
      setFilteredRecommendations(filtered);
    },
    [recommendations, applyFilters]
  );

  // Atualiza recomendações filtradas quando as recomendações ou filtros mudam
  useEffect(() => {
    const filtered = applyFilters(recommendations, filters);
    setFilteredRecommendations(filtered);
  }, [recommendations, filters, applyFilters]);

  /**
   * Processa as recomendações com base nos dados do formulário
   * @param {Object} formData - Dados do formulário
   */
  const handleGenerateRecommendations = useCallback(
    async (formData) => {
      if (!products || products.length === 0) {
        setRecommendationError("Nenhum produto disponível para recomendação");
        addToast({
          type: "error",
          title: "Erro",
          message: "Nenhum produto disponível para recomendação",
        });
        return;
      }

      setIsProcessingRecommendations(true);
      setRecommendationError(null);
      setSelectedRecommendation(null);

      try {
        const result = await recommendationService.getRecommendations(
          formData,
          products
        );
        setRecommendations(result);
        setFilteredRecommendations(result); // Inicializa com todos os resultados

        if (result.length === 0) {
          setRecommendationError(
            "Nenhuma recomendação encontrada para os critérios selecionados"
          );
          addToast({
            type: "warning",
            title: "Nenhuma recomendação",
            message: "Tente ajustar seus critérios de busca",
          });
        } else {
          addToast({
            type: "success",
            title: "Recomendações geradas!",
            message: `${result.length} produto(s) encontrado(s)`,
          });
        }
      } catch (error) {
        console.error("Erro ao gerar recomendações:", error);
        setRecommendationError("Erro ao gerar recomendações. Tente novamente.");
        setRecommendations([]);
        setFilteredRecommendations([]);
        addToast({
          type: "error",
          title: "Erro no sistema",
          message: "Tente novamente em alguns instantes",
        });
      } finally {
        setIsProcessingRecommendations(false);
      }
    },
    [products, addToast]
  );

  /**
   * Limpa as recomendações
   */
  const handleResetRecommendations = useCallback(() => {
    setRecommendations([]);
    setFilteredRecommendations([]);
    setSelectedRecommendation(null);
    setRecommendationError(null);
  }, []);

  /**
   * Seleciona uma recomendação específica
   * @param {Object} recommendation - Recomendação selecionada
   */
  const handleSelectRecommendation = useCallback((recommendation) => {
    setSelectedRecommendation(recommendation);
  }, []);

  /**
   * Abre o modal com os detalhes do produto
   * @param {Object} product - Produto selecionado
   */
  const handleProductCardClick = useCallback((product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }, []);

  /**
   * Fecha o modal de produto
   */
  const handleCloseProductModal = useCallback(() => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  }, []);

  /**
   * Tenta recarregar os dados em caso de erro
   */
  const handleRetryData = useCallback(async () => {
    handleResetRecommendations();
    await refetchProducts();
  }, [refetchProducts, handleResetRecommendations]);

  /**
   * Handler personalizado para o formulário com controle de passos
   */
  const handleFormSubmit = useCallback(
    async (formData) => {
      await handleGenerateRecommendations(formData);
    },
    [handleGenerateRecommendations]
  );

  /**
   * Renderiza o conteúdo da seção de recomendações
   */
  const renderRecommendationContent = () => {
    if (isProcessingRecommendations) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingState
            message="Analisando suas preferências e gerando recomendações..."
            size="medium"
          />
        </div>
      );
    }

    if (recommendationError) {
      return (
        <div className="p-6 rounded-lg border bg-rd-error border-rd-error text-rd-error">
          <ErrorState
            title="Erro nas Recomendações"
            message={recommendationError}
            onRetry={handleResetRecommendations}
            retryText="Tentar Novamente"
            variant="error"
          />
        </div>
      );
    }

    if (recommendations.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-rd-gray text-5xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-rd-blue-dark mb-2">
            Nenhuma recomendação ainda
          </h3>
          <p className="text-rd-gray">
            Preencha o formulário acima para receber recomendações
            personalizadas.
          </p>
        </div>
      );
    }

    const availableCategories = [
      ...new Set(recommendations.map((rec) => rec.category).filter(Boolean)),
    ];

    return (
      <div className="space-y-6">
        {/* Estatísticas */}
        <StatsCards
          recommendations={recommendations}
          totalProducts={products?.length || 0}
          className="fade-in"
        />

        {/* Filtros Avançados - só aparece quando há mais de 1 recomendação */}
        {recommendations.length > 1 && (
          <AdvancedFilters
            onFiltersChange={handleFiltersChange}
            availableCategories={availableCategories}
            className="fade-in"
          />
        )}

        {/* Lista de Recomendações */}
        <RecommendationList
          recommendations={filteredRecommendations}
          selectedItem={selectedRecommendation}
          onItemSelect={handleSelectRecommendation}
          onItemCardClick={handleProductCardClick}
          className="fade-in"
        />
      </div>
    );
  };

  // Estado de loading inicial dos produtos
  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-rd-gray-light flex flex-col justify-center items-center">
        <div className="text-center max-w-md">
          <LoadingState
            message="Carregando produtos disponíveis..."
            size="large"
          />
          <p className="text-rd-gray mt-4">
            Aguarde enquanto preparamos o sistema de recomendações para você.
          </p>
        </div>
      </div>
    );
  }

  // Estado de erro dos produtos
  if (hasProductsError) {
    return (
      <div className="min-h-screen bg-rd-gray-light flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full">
          <ErrorState
            title="Erro ao carregar o sistema"
            message={productsErrorMessage}
            onRetry={handleRetryData}
            retryText="Recarregar Sistema"
            variant="error"
          />
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <>
        {/* Header fixo */}
        <Header />

        {/* Conteúdo principal com padding-top para compensar o header fixo */}
        <div className="min-h-screen bg-rd-gray-light pt-24">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="space-y-8">
              {/* Seção do Formulário */}
              <section>
                <div className="bg-rd-white rounded-xl shadow-lg p-6 card-hover">
                  <header className="border-b border-rd-gray pb-4 mb-6">
                    <h2 className="text-2xl font-semibold text-rd-blue-dark mb-2">
                      Preencha suas Preferências
                    </h2>
                    <p className="text-rd-gray">
                      Nos conte sobre suas necessidades para personalizar as
                      recomendações
                    </p>
                  </header>

                  <RecommendationForm
                    onSubmit={handleFormSubmit}
                    onReset={handleResetRecommendations}
                    isProcessing={isProcessingRecommendations}
                    isDisabled={isLoadingProducts || hasProductsError}
                  />
                </div>
              </section>

              {/* Seção das Recomendações */}
              <section>
                <div className="bg-rd-white rounded-xl shadow-lg p-6 card-hover">
                  <header className="border-b border-rd-gray pb-4 mb-6">
                    <h2 className="text-2xl font-semibold text-rd-blue-dark mb-2">
                      Recomendações Personalizadas
                    </h2>
                    {recommendations.length > 0 && (
                      <p className="text-rd-gray">
                        {filteredRecommendations.length} de{" "}
                        {recommendations.length} recomendações
                      </p>
                    )}
                  </header>

                  {renderRecommendationContent()}
                </div>
              </section>
            </div>

            {/* Modal de Detalhes do Produto */}
            <ProductModal
              isOpen={isProductModalOpen}
              onClose={handleCloseProductModal}
              product={selectedProduct}
            />
          </div>
        </div>

        {/* Botão flutuante de voltar ao topo */}
        <ScrollToTop />

        {/* Container de Notificações */}
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </>
    </ThemeProvider>
  );
}

export default App;
