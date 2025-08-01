/**
 * Componente AdvancedFilters - Filtros avançados para recomendações
 * Permite filtrar e ordenar resultados de forma intuitiva
 */

import { Filter, Search, SortAsc, SortDesc, X } from "lucide-react";
import PropTypes from "prop-types";
import { memo, useState } from "react";

/**
 * Componente de filtros avançados
 */
const AdvancedFilters = memo(
  ({
    onFiltersChange,
    availableCategories = [],
    className = "",
    "data-testid": testId = "advanced-filters",
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState({
      search: "",
      category: "",
      sortBy: "ranking",
      sortOrder: "asc",
    });

    const handleFilterChange = (key, value) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      onFiltersChange?.(newFilters);
    };

    const handleSortChange = (sortBy, sortOrder) => {
      const newFilters = { ...filters, sortBy, sortOrder };
      setFilters(newFilters);
      onFiltersChange?.(newFilters);
    };

    const clearFilters = () => {
      const clearedFilters = {
        search: "",
        category: "",
        sortBy: "ranking",
        sortOrder: "asc",
      };
      setFilters(clearedFilters);
      onFiltersChange?.(clearedFilters);
    };

    const hasActiveFilters = filters.search || filters.category;

    return (
      <div className={`${className}`} data-testid={testId}>
        {/* Header com Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-rd-white border border-rd-gray rounded-lg hover:bg-rd-sky-light transition-colors"
          >
            <Filter className="w-4 h-4 text-rd-blue" />
            <span className="text-sm font-medium text-rd-blue-dark">
              Filtros e Ordenação
            </span>
            {hasActiveFilters && (
              <span className="bg-rd-blue text-white text-xs px-2 py-1 rounded-full">
                {Object.values(filters).filter(Boolean).length - 2}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rd-gray hover:text-rd-blue flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Painel de Filtros */}
        {isExpanded && (
          <div className="bg-rd-white border border-rd-gray rounded-lg p-4 space-y-4 slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Busca por Texto */}
              <div>
                <label className="block text-sm font-medium text-rd-blue-dark mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-rd-gray" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Nome do produto..."
                    className="w-full pl-9 pr-3 py-2 border border-rd-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rd-blue focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Filtro por Categoria */}
              <div>
                <label className="block text-sm font-medium text-rd-blue-dark mb-2">
                  Categoria
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 pr-8 py-2 border border-rd-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rd-blue focus:border-transparent transition-all appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23949494' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1rem",
                  }}
                >
                  <option value="">Todas as categorias</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação */}
              <div>
                <label className="block text-sm font-medium text-rd-blue-dark mb-2">
                  Ordenar por
                </label>
                <div className="flex gap-1">
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleSortChange(e.target.value, filters.sortOrder)
                    }
                    className="flex-1 px-3 pr-8 py-2 border border-rd-gray rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rd-blue focus:border-transparent transition-all appearance-none bg-white"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23949494' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.75rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1rem",
                    }}
                  >
                    <option value="ranking">Ranking</option>
                    <option value="name">Nome</option>
                    <option value="category">Categoria</option>
                  </select>
                  <button
                    onClick={() =>
                      handleSortChange(
                        filters.sortBy,
                        filters.sortOrder === "asc" ? "desc" : "asc"
                      )
                    }
                    className="px-3 py-2 bg-rd-blue text-white rounded-r-lg hover:bg-rd-blue-dark transition-colors"
                    title={`Ordenar ${
                      filters.sortOrder === "asc" ? "crescente" : "decrescente"
                    }`}
                  >
                    {filters.sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Filtros Rápidos */}
            <div>
              <label className="block text-sm font-medium text-rd-blue-dark mb-2">
                Filtros Rápidos
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: "Melhor Ranking",
                    action: () => handleSortChange("ranking", "asc"),
                  },
                  {
                    label: "Pior Ranking",
                    action: () => handleSortChange("ranking", "desc"),
                  },
                  {
                    label: "A-Z",
                    action: () => handleSortChange("name", "asc"),
                  },
                  {
                    label: "Z-A",
                    action: () => handleSortChange("name", "desc"),
                  },
                ].map((quickFilter) => (
                  <button
                    key={quickFilter.label}
                    onClick={quickFilter.action}
                    className="px-3 py-1 text-xs bg-rd-sky-light text-rd-blue-dark rounded-full hover:bg-rd-cyan-light transition-colors"
                  >
                    {quickFilter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AdvancedFilters.propTypes = {
  onFiltersChange: PropTypes.func,
  availableCategories: PropTypes.array,
  className: PropTypes.string,
  "data-testid": PropTypes.string,
};

AdvancedFilters.displayName = "AdvancedFilters";

export default AdvancedFilters;
