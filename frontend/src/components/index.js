/**
 * Arquivo de exportação centralizada dos componentes
 * Permite imports mais limpos e organizados
 */

// Form components
export { default as FeaturesField } from './Form/Fields/FeaturesField';
export { default as PreferencesField } from './Form/Fields/PreferencesField';
export { default as RecommendationTypeField } from './Form/Fields/RecommendationTypeField';
export { default as RecommendationForm } from './Form/RecommendationForm';
export { default as SubmitButton } from './Form/SubmitButton/SubmitButton';

// Product Modal components
export { default as ProductModal } from './ProductModal/ProductModal';

// Recommendation List components
export { default as RecommendationList } from './RecommendationList/RecommendationList';

// Shared components
export { default as AdvancedFilters } from './shared/AdvancedFilters';
export { default as Header } from './shared/Header';
export { default as Input } from './shared/Input';
export { default as Modal } from './shared/Modal';
export { default as RecommendationContent } from './shared/RecommendationContent';
export { default as ScrollToTop } from './shared/ScrollToTop';
export { EmptyState, ErrorState, LoadingState } from './shared/StateComponents';
export { default as StatsCards } from './shared/StatsCards';
export { default as ThemeSwitch } from './shared/ThemeSwitch';
