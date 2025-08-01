/**
 * Índice centralizado dos hooks personalizados da aplicação
 *
 * Este arquivo exporta todos os hooks customizados para facilitar
 * a importação e manutenibilidade do código.
 */

// Hook para gerenciamento de formulários
export { default as useForm } from './useForm';

// Hook para busca e gerenciamento de produtos
export { default as useProducts } from './useProducts';

// Hook para sistema de recomendações
export { default as useRecommendations } from './useRecommendations';

// Hook para gerenciamento completo de recomendações e filtros
export { useRecommendationManager } from './useRecommendationManager';

// Hook para gerenciamento do modal de produto
export { useProductModal } from './useProductModal';

// Hooks genéricos para seleção
export { default as useMultipleSelection } from './useMultipleSelection';
export { default as useSingleSelection } from './useSingleSelection';
