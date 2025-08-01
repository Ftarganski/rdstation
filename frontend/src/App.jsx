/**
 * Componente principal da aplicação refatorado
 * Segue princípios SOLID, DRY e Clean Code
 * Separação clara de responsabilidades
 */

import {
  AppErrorState,
  AppLoadingState,
  Header,
  ProductModal,
  RecommendationContent,
  RecommendationForm,
  ScrollToTop,
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
      <AppLoadingState
        message="Carregando produtos disponíveis..."
        description="Aguarde enquanto preparamos o sistema de recomendações para você."
      />
    );
  }

  // Estado de erro dos produtos
  if (hasProductsError) {
    return (
      <AppErrorState message={productsErrorMessage} onRetry={handleRetryData} />
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
                    onReset={resetRecommendations}
                    isProcessing={isProcessing}
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
                </div>
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
      </>
    </ThemeProvider>
  );
}

export default App;
