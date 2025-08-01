/**
 * Componente que renderiza o conteúdo das recomendações
 */

import {
  AdvancedFilters,
  ErrorState,
  LoadingState,
  RecommendationList,
  StatsCards,
} from "@/components";
import { FileText } from "lucide-react";
import PropTypes from "prop-types";

const RecommendationContent = ({
  isProcessing,
  error,
  recommendations,
  filteredRecommendations,
  products,
  selectedRecommendation,
  onFiltersChange,
  onRecommendationSelect,
  onProductCardClick,
  onErrorRetry,
}) => {
  // Estado de processamento
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <LoadingState
          message="Analisando suas preferências e gerando recomendações..."
          size="medium"
        />
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="p-6 rounded-lg border bg-rd-error border-rd-error text-rd-error">
        <ErrorState
          title="Erro nas Recomendações"
          message={error}
          onRetry={onErrorRetry}
          retryText="Tentar Novamente"
          variant="error"
        />
      </div>
    );
  }

  // Estado vazio
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <FileText className="w-16 h-16 text-rd-gray" strokeWidth={1} />
        </div>
        <h3 className="text-lg font-medium text-rd-blue-dark mb-2">
          Nenhuma recomendação ainda
        </h3>
        <p className="text-rd-gray">
          Preencha o formulário acima para receber recomendações personalizadas.
        </p>
      </div>
    );
  }

  // Categorias disponíveis para filtros
  const availableCategories = [
    ...new Set(recommendations.map((rec) => rec.category).filter(Boolean)),
  ];

  // Estado com recomendações
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
          onFiltersChange={onFiltersChange}
          availableCategories={availableCategories}
          className="fade-in"
        />
      )}

      {/* Lista de Recomendações */}
      <RecommendationList
        recommendations={filteredRecommendations}
        selectedItem={selectedRecommendation}
        onItemSelect={onRecommendationSelect}
        onItemCardClick={onProductCardClick}
        className="fade-in"
      />
    </div>
  );
};

RecommendationContent.propTypes = {
  isProcessing: PropTypes.bool.isRequired,
  error: PropTypes.string,
  recommendations: PropTypes.array.isRequired,
  filteredRecommendations: PropTypes.array.isRequired,
  products: PropTypes.array,
  selectedRecommendation: PropTypes.object,
  onFiltersChange: PropTypes.func.isRequired,
  onRecommendationSelect: PropTypes.func.isRequired,
  onProductCardClick: PropTypes.func.isRequired,
  onErrorRetry: PropTypes.func.isRequired,
};

export default RecommendationContent;
