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
export { default as Input } from './shared/Input';
export { default as Modal } from './shared/Modal';
export { ErrorState, LoadingState } from './shared/StateComponents';
