/**
 * Componente principal da aplicação refatorado
 * Segue princípios SOLID, DRY e Clean Code
 * Separação clara de responsabilidades
 */

import {
  ErrorState,
  Header,
  LoadingState,
  ProductModal,
  RecommendationContent,
  RecommendationForm,
  ScrollToTop,
  SectionHeader,
} from "@/components";
import { ThemeProvider } from "@/contexts";
import {
  useProductModal,
  useProducts,
  useRecommendationManager,
} from "@/hooks";
import { useCallback } from "react";

/**
 * Componente principal da aplicação
 */
function App() {
  // Hook para gerenciamento de produtos
  const {
    products,
    isLoading: isLoadingProducts,
    hasError: hasProductsError,
    errorMessage: productsErrorMessage,
    refetchProducts,
  } = useProducts();

  // Hook para gerenciamento de recomendações
  const {
    recommendations,
    filteredRecommendations,
    selectedRecommendation,
    isProcessing,
    error: recommendationError,
    generateRecommendations,
    resetRecommendations,
    selectRecommendation,
    handleFiltersChange,
  } = useRecommendationManager(products);

  // Hook para gerenciamento do modal de produto
  const {
    isOpen: isProductModalOpen,
    selectedProduct,
    openModal: openProductModal,
    closeModal: closeProductModal,
  } = useProductModal();

  /**
   * Handler para submissão do formulário
   */
  const handleFormSubmit = useCallback(
    async (formData) => {
      await generateRecommendations(formData);
    },
    [generateRecommendations]
  );

  /**
   * Handler para tentar recarregar dados em caso de erro
   */
  const handleRetryData = useCallback(async () => {
    resetRecommendations();
    await refetchProducts();
  }, [refetchProducts, resetRecommendations]);

  // Estado de loading inicial dos produtos
  if (isLoadingProducts) {
    return (
      <LoadingState
        variant="app"
        size="large"
        message="Carregando produtos disponíveis..."
        description="Aguarde enquanto preparamos o sistema de recomendações para você."
      />
    );
  }

  // Estado de erro dos produtos
  if (hasProductsError) {
    return (
      <ErrorState
        layout="app"
        title="Erro ao carregar o sistema"
        message={productsErrorMessage}
        onRetry={handleRetryData}
        retryText="Recarregar Sistema"
      />
    );
  }

  return (
    <ThemeProvider>
      {/* Header fixo */}
      <Header />

      {/* Conteúdo principal com padding-top para compensar o header fixo */}
      <div className="min-h-screen bg-rd-gray-light pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Seção do Formulário */}
            <section className="bg-rd-white rounded-xl shadow-lg p-6 card-hover">
              <SectionHeader
                title="Preencha suas Preferências"
                description="Nos conte sobre suas necessidades para personalizar as recomendações"
              />

              <RecommendationForm
                onSubmit={handleFormSubmit}
                onReset={resetRecommendations}
                isProcessing={isProcessing}
                isDisabled={isLoadingProducts || hasProductsError}
              />
            </section>

            {/* Seção das Recomendações */}
            <section className="bg-rd-white rounded-xl shadow-lg p-6 card-hover">
              <SectionHeader title="Recomendações Personalizadas">
                {recommendations.length > 0 && (
                  <p className="text-rd-gray">
                    {filteredRecommendations.length} de {recommendations.length}{" "}
                    recomendações
                  </p>
                )}
              </SectionHeader>

              <RecommendationContent
                isProcessing={isProcessing}
                error={recommendationError}
                recommendations={recommendations}
                filteredRecommendations={filteredRecommendations}
                products={products}
                selectedRecommendation={selectedRecommendation}
                onFiltersChange={handleFiltersChange}
                onRecommendationSelect={selectRecommendation}
                onProductCardClick={openProductModal}
                onErrorRetry={resetRecommendations}
              />
            </section>
          </div>

          {/* Modal de Detalhes do Produto */}
          <ProductModal
            isOpen={isProductModalOpen}
            onClose={closeProductModal}
            product={selectedProduct}
          />
        </div>
      </div>

      {/* Botão flutuante de voltar ao topo */}
      <ScrollToTop />
    </ThemeProvider>
  );
}

export default App;
