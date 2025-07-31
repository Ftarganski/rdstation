/**
 * Componente de Lista de Recomendações Refatorado
 * Segue princípios SOLID, DRY e Clean Code
 * Extensível e com boa UX
 */

import PropTypes from "prop-types";
import { memo } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../shared/StateComponents";

/**
 * Componente para renderizar um item individual de recomendação
 * @param {Object} props - Propriedades do componente
 */
const RecommendationItem = memo(
  ({
    recommendation,
    index,
    onSelect,
    isSelected = false,
    showDetails = true,
    "data-testid": testId,
  }) => {
    const handleClick = () => {
      onSelect?.(recommendation, index);
    };

    return (
      <div
        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
        }`}
        onClick={handleClick}
        data-testid={testId}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {recommendation.name}
            </h3>

            {showDetails && recommendation.description && (
              <p className="text-gray-600 text-sm mb-3">
                {recommendation.description}
              </p>
            )}

            {showDetails && (
              <div className="space-y-2">
                {recommendation.preferences &&
                  recommendation.preferences.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs font-medium text-gray-500">
                        Preferências:
                      </span>
                      {recommendation.preferences.map((pref, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  )}

                {recommendation.features &&
                  recommendation.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs font-medium text-gray-500">
                        Funcionalidades:
                      </span>
                      {recommendation.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className="ml-4 flex items-center">
            <div className="text-right">
              <div className="text-sm text-gray-500">Ranking</div>
              <div className="text-lg font-bold text-blue-600">
                #{index + 1}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

/**
 * Componente principal da lista de recomendações
 * @param {Object} props - Propriedades do componente
 */
const RecommendationList = memo(
  ({
    recommendations = [],
    isLoading = false,
    hasError = false,
    errorMessage = "",
    onRetry,
    onItemSelect,
    selectedItem = null,
    title = "Recomendações de Produtos",
    emptyTitle = "Nenhuma recomendação encontrada",
    emptyMessage = "Preencha o formulário ao lado para obter recomendações personalizadas de produtos.",
    showDetails = true,
    className = "",
    "data-testid": testId = "recommendation-list",
  }) => {
    // Estado de loading
    if (isLoading) {
      return (
        <div className={`${className}`} data-testid={testId}>
          <h2 className="text-xl font-bold mb-6 text-gray-800">{title}</h2>
          <LoadingState
            message="Gerando recomendações personalizadas..."
            size="medium"
          />
        </div>
      );
    }

    // Estado de erro
    if (hasError) {
      return (
        <div className={`${className}`} data-testid={testId}>
          <h2 className="text-xl font-bold mb-6 text-gray-800">{title}</h2>
          <ErrorState
            title="Erro ao gerar recomendações"
            message={errorMessage}
            onRetry={onRetry}
            retryText="Tentar novamente"
            variant="error"
          />
        </div>
      );
    }

    // Estado vazio
    if (recommendations.length === 0) {
      return (
        <div className={`${className}`} data-testid={testId}>
          <h2 className="text-xl font-bold mb-6 text-gray-800">{title}</h2>
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            icon={
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
          />
        </div>
      );
    }

    return (
      <div className={`${className}`} data-testid={testId}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <div className="text-sm text-gray-600">
            {recommendations.length} recomendaç
            {recommendations.length === 1 ? "ão" : "ões"} encontrada
            {recommendations.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <RecommendationItem
              key={recommendation.id || index}
              recommendation={recommendation}
              index={index}
              onSelect={onItemSelect}
              isSelected={selectedItem?.id === recommendation.id}
              showDetails={showDetails}
              data-testid={`recommendation-item-${index}`}
            />
          ))}
        </div>

        {recommendations.length > 1 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              💡 Os produtos estão ordenados por relevância baseada nas suas
              preferências e funcionalidades selecionadas.
            </p>
          </div>
        )}
      </div>
    );
  }
);

// PropTypes
RecommendationItem.propTypes = {
  recommendation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    preferences: PropTypes.array,
    features: PropTypes.array,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  showDetails: PropTypes.bool,
  "data-testid": PropTypes.string,
};

RecommendationList.propTypes = {
  recommendations: PropTypes.array,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onRetry: PropTypes.func,
  onItemSelect: PropTypes.func,
  selectedItem: PropTypes.object,
  title: PropTypes.string,
  emptyTitle: PropTypes.string,
  emptyMessage: PropTypes.string,
  showDetails: PropTypes.bool,
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

// Display names
RecommendationItem.displayName = "RecommendationItem";
RecommendationList.displayName = "RecommendationList";

export default RecommendationList;
