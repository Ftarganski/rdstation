/**
 * Componente StatsCards - Exibe estatísticas das recomendações
 * Mostra métricas relevantes de forma visual e atrativa
 */

import { STATS_COLOR_TOKENS, STATS_TYPE_CONFIG } from "@/constants";
import { Award, BarChart3, Target, TrendingUp } from "lucide-react";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Card individual de estatística
 */
const StatCard = memo(
  ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = "blue",
    className = "",
    "data-testid": testId,
  }) => {
    const colorVariants = {
      [STATS_COLOR_TOKENS.PRIMARY]: {
        bg: "bg-rd-sky-light",
        icon: "text-rd-blue",
        text: "text-rd-blue-dark",
        border: "border-rd-blue",
      },
      [STATS_COLOR_TOKENS.PERFORMANCE]: {
        bg: "bg-rd-cyan-light",
        icon: "text-rd-cyan",
        text: "text-rd-blue-dark",
        border: "border-rd-cyan",
      },
      [STATS_COLOR_TOKENS.SUCCESS]: {
        bg: "bg-rd-cyan-light",
        icon: "text-rd-green",
        text: "text-rd-blue-dark",
        border: "border-rd-green",
      },
      [STATS_COLOR_TOKENS.ANALYSIS]: {
        bg: "bg-rd-sky-light",
        icon: "text-rd-blue-light",
        text: "text-rd-blue-dark",
        border: "border-rd-blue-light",
      },
    };

    const variant = colorVariants[color];

    return (
      <div
        className={`
          ${variant.bg} border ${variant.border} rounded-xl p-6
          card-hover transition-all duration-300
          ${className}
        `}
        data-testid={testId}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${variant.text} opacity-80`}>
              {title}
            </h3>
            <div className="mt-2 flex items-baseline">
              <p className={`text-3xl font-bold ${variant.text}`}>{value}</p>
              {trend && (
                <div
                  className={`
                    ml-2 flex items-center text-xs font-medium
                    ${
                      trend > 0
                        ? "text-rd-green"
                        : trend < 0
                        ? "text-rd-red"
                        : "text-rd-gray"
                    }
                  `}
                >
                  <TrendingUp
                    className={`
                      w-3 h-3 mr-1
                      ${trend < 0 ? "transform rotate-180" : ""}
                    `}
                  />
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
            {description && (
              <p className={`text-sm ${variant.text} opacity-70 mt-1`}>
                {description}
              </p>
            )}
          </div>

          <div className={`p-3 rounded-lg bg-white bg-opacity-50`}>
            <Icon className={`w-6 h-6 ${variant.icon}`} />
          </div>
        </div>
      </div>
    );
  }
);

/**
 * Container principal das estatísticas
 */
const StatsCards = memo(
  ({
    recommendations = [],
    totalProducts = 0,
    className = "",
    "data-testid": testId = "stats-cards",
  }) => {
    // Cálculo das estatísticas
    const totalRecommendations = recommendations.length;
    const averageScore =
      recommendations.length > 0
        ? Math.round(
            recommendations.reduce((sum, rec) => sum + (rec.score || 0), 0) /
              recommendations.length
          )
        : 0;

    const uniqueCategories = [
      ...new Set(recommendations.map((rec) => rec.category).filter(Boolean)),
    ].length;

    const matchPercentage =
      totalProducts > 0
        ? Math.round((totalRecommendations / totalProducts) * 100)
        : 0;

    const stats = [
      {
        title: "Recomendações",
        value: totalRecommendations,
        icon: Target,
        description: "Produtos encontrados",
        color: STATS_TYPE_CONFIG.RECOMMENDATIONS.colorToken,
        trend: totalRecommendations > 0 ? 12 : 0,
      },
      {
        title: "Score Médio",
        value: averageScore,
        icon: Award,
        description: "Relevância média",
        color: STATS_TYPE_CONFIG.AVERAGE_SCORE.colorToken,
        trend: averageScore > 7 ? 8 : averageScore > 5 ? 2 : -5,
      },
      {
        title: "Categorias",
        value: uniqueCategories,
        icon: BarChart3,
        description: "Tipos diferentes",
        color: STATS_TYPE_CONFIG.CATEGORIES.colorToken,
        trend: uniqueCategories > 1 ? 15 : 0,
      },
      {
        title: "Taxa de Match",
        value: `${matchPercentage}%`,
        icon: TrendingUp,
        description: "Compatibilidade",
        color: STATS_TYPE_CONFIG.MATCH_RATE.colorToken,
        trend: matchPercentage > 50 ? 10 : matchPercentage > 25 ? 0 : -3,
      },
    ];

    if (totalRecommendations === 0) {
      return null;
    }

    return (
      <div className={`${className}`} data-testid={testId}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-rd-blue-dark mb-2">
            Estatísticas das Recomendações
          </h3>
          <p className="text-sm text-rd-gray">
            Análise detalhada dos resultados encontrados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard
                {...stat}
                data-testid={`stat-card-${stat.title.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        {/* Insights adicionais */}
        {totalRecommendations > 0 && (
          <div className="mt-6 p-4 bg-rd-gray-light rounded-lg border border-rd-gray">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-rd-blue" />
              <h4 className="text-sm font-semibold text-rd-blue-dark">
                Insights da Análise
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-rd-gray">
              <div>
                • Score médio de {averageScore}/6 indica{" "}
                {averageScore > 7
                  ? "excelente compatibilidade"
                  : averageScore > 5
                  ? "boa compatibilidade"
                  : "compatibilidade básica"}
              </div>
              <div>
                •{" "}
                {uniqueCategories > 1
                  ? `Diversidade em ${uniqueCategories} categorias`
                  : "Foco em uma categoria específica"}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  description: PropTypes.string,
  trend: PropTypes.number,
  color: PropTypes.oneOf([
    STATS_COLOR_TOKENS.PRIMARY,
    STATS_COLOR_TOKENS.PERFORMANCE,
    STATS_COLOR_TOKENS.SUCCESS,
    STATS_COLOR_TOKENS.ANALYSIS,
  ]),
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

StatsCards.propTypes = {
  recommendations: PropTypes.array,
  totalProducts: PropTypes.number,
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

StatCard.displayName = "StatCard";
StatsCards.displayName = "StatsCards";

export { StatCard, StatsCards };
export default StatsCards;
