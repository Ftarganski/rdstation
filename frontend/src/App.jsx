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
  RecommendationForm,
  RecommendationList,
} from "@/components";
import { useProducts } from "@/hooks";
import { recommendationService } from "@/services";
import { useCallback, useState } from "react";

/**
 * Componente principal da aplicação
 */
function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isProcessingRecommendations, setIsProcessingRecommendations] =
    useState(false);
  const [recommendationError, setRecommendationError] = useState(null);

  // Estados para o modal de produto
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    products,
    isLoading: isLoadingProducts,
    hasError: hasProductsError,
    errorMessage: productsErrorMessage,
    refetchProducts,
  } = useProducts();

  /**
   * Processa as recomendações com base nos dados do formulário
   * @param {Object} formData - Dados do formulário
   */
  const handleGenerateRecommendations = useCallback(
    async (formData) => {
      if (!products || products.length === 0) {
        setRecommendationError("Nenhum produto disponível para recomendação");
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

        if (result.length === 0) {
          setRecommendationError(
            "Nenhuma recomendação encontrada para os critérios selecionados"
          );
        }
      } catch (error) {
        console.error("Erro ao gerar recomendações:", error);
        setRecommendationError("Erro ao gerar recomendações. Tente novamente.");
        setRecommendations([]);
      } finally {
        setIsProcessingRecommendations(false);
      }
    },
    [products]
  );

  /**
   * Limpa as recomendações
   */
  const handleResetRecommendations = useCallback(() => {
    setRecommendations([]);
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
            Preencha o formulário ao lado para receber recomendações
            personalizadas.
          </p>
        </div>
      );
    }

    return (
      <RecommendationList
        recommendations={recommendations}
        selectedItem={selectedRecommendation}
        onItemSelect={handleSelectRecommendation}
        onItemCardClick={handleProductCardClick}
      />
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
    <>
      {/* Header fixo */}
      <Header />

      {/* Conteúdo principal com padding-top para compensar o header fixo */}
      <div className="min-h-screen bg-rd-gray-light pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <div className="bg-rd-white rounded-xl shadow-lg p-6 ">
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
                  onSubmit={handleGenerateRecommendations}
                  isProcessing={isProcessingRecommendations}
                  isDisabled={isLoadingProducts || hasProductsError}
                />
              </div>
            </section>

            <section>
              <div className="bg-rd-white rounded-xl shadow-lg p-6 ">
                <header className="border-b border-rd-gray pb-4 mb-6">
                  <h2 className="text-2xl font-semibold text-rd-blue-dark mb-2">
                    Recomendações Personalizadas
                  </h2>
                  {recommendations.length > 0 && (
                    <p className="text-rd-gray">
                      {recommendations.length} recomendações encontradas
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
    </>
  );
}

export default App;
