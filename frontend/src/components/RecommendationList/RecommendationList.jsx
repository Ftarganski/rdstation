/**
 * Componente de Lista de Recomendações Refatorado
 * Segue princípios SOLID, DRY e Clean Code
 * Extensível e com boa UX
 */

import { EmptyState, ErrorState, LoadingState } from "@/components";
import { Archive, Eye, Lightbulb } from "lucide-react";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Componente para renderizar um item individual de recomendação
 * @param {Object} props - Propriedades do componente
 */
const RecommendationItem = memo(
  ({
    recommendation,
    index,
    onSelect,
    onCardClick,
    isSelected = false,
    showDetails = true,
    "data-testid": testId,
  }) => {
    const handleClick = () => {
      onSelect?.(recommendation, index);
    };

    const handleCardClick = (event) => {
      // Previne o evento de seleção quando o modal é aberto
      event.stopPropagation();
      onCardClick?.(recommendation);
    };

    return (
      <div
        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
          isSelected
            ? "border-rd-cyan bg-rd-cyan-light shadow-md"
            : "border-rd-gray hover:border-rd-cyan hover:shadow-sm"
        }`}
        onClick={handleClick}
        data-testid={testId}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-rd-blue-dark mb-2">
              {recommendation.name}
            </h3>

            {recommendation.description && (
              <p className="text-rd-gray text-sm mb-3">
                {recommendation.description}
              </p>
            )}

            {showDetails && (
              <div className="space-y-2">
                {recommendation.preferences &&
                  recommendation.preferences.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs font-medium text-rd-gray">
                        Preferências:
                      </span>
                      {recommendation.preferences
                        .slice(0, 2)
                        .map((pref, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 text-xs bg-rd-sky-light text-rd-blue-dark rounded"
                          >
                            {pref}
                          </span>
                        ))}
                      {recommendation.preferences.length > 2 && (
                        <span className="text-xs text-rd-gray">
                          +{recommendation.preferences.length - 2} mais
                        </span>
                      )}
                    </div>
                  )}

                {recommendation.features &&
                  recommendation.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs font-medium text-rd-gray">
                        Funcionalidades:
                      </span>
                      {recommendation.features
                        .slice(0, 2)
                        .map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 text-xs bg-rd-cyan-light text-rd-blue-dark rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      {recommendation.features.length > 2 && (
                        <span className="text-xs text-rd-gray">
                          +{recommendation.features.length - 2} mais
                        </span>
                      )}
                    </div>
                  )}
              </div>
            )}

            {/* Botão Ver Detalhes */}
            <div className="mt-3 pt-3 border-t border-rd-gray">
              <button
                onClick={handleCardClick}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-rd-blue-dark bg-rd-sky-light hover:bg-rd-cyan-light rounded-md transition-colors duration-200"
              >
                <Eye className="w-4 h-4" />
                Ver Detalhes
              </button>
            </div>
          </div>

          <div className="ml-4 flex items-center">
            <div className="text-right">
              <div className="text-sm text-rd-gray">Ranking</div>
              <div className="text-lg font-bold text-rd-blue">#{index + 1}</div>
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
    onItemCardClick,
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
          <h2 className="text-xl font-bold mb-6 text-rd-blue-dark">{title}</h2>
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
          <h2 className="text-xl font-bold mb-6 text-rd-blue-dark">{title}</h2>
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
          <h2 className="text-xl font-bold mb-6 text-rd-blue-dark">{title}</h2>
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            icon={
              <Archive className="h-16 w-16 text-rd-gray" strokeWidth={1} />
            }
          />
        </div>
      );
    }

    return (
      <div className={`${className}`} data-testid={testId}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-rd-blue-dark">{title}</h2>
        </div>

        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <RecommendationItem
              key={recommendation.id || index}
              recommendation={recommendation}
              index={index}
              onSelect={onItemSelect}
              onCardClick={onItemCardClick}
              isSelected={selectedItem?.id === recommendation.id}
              showDetails={showDetails}
              data-testid={`recommendation-item-${index}`}
            />
          ))}
        </div>

        {recommendations.length > 1 && (
          <div className="mt-6 p-4 bg-rd-gray-light rounded-lg">
            <p className="text-sm text-rd-gray text-center flex items-center justify-center gap-2">
              <Lightbulb className="w-8 h-8 text-rd-cyan" />
              Os produtos estão ordenados por relevância baseada nas suas
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
  onCardClick: PropTypes.func,
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
  onItemCardClick: PropTypes.func,
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
