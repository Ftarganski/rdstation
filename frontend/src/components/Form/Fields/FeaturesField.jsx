/**
 * Componente especializado para seleção de funcionalidades
 * Segue o princípio SRP e utiliza composição
 * Reutiliza lógica comum através de hooks
 */

import { Input } from "@/components";
import { useMultipleSelection } from "@/hooks";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Componente para seleção múltipla de funcionalidades
 * @param {Object} props - Propriedades do componente
 */
const FeaturesField = memo(
  ({
    features = [],
    initialSelected = [],
    onChange,
    title = "Funcionalidades",
    className = "",
    isLoading = false,
    disabled = false,
    required = false,
    "data-testid": testId = "features-field",
  }) => {
    const { selectedItems, toggleSelection, isSelected, selectionCount } =
      useMultipleSelection(initialSelected);

    const handleFeatureChange = (feature) => {
      if (disabled) return;

      toggleSelection(feature);

      // Notifica o componente pai sobre a mudança
      if (onChange) {
        const newSelection = isSelected(feature)
          ? selectedItems.filter((item) => item !== feature)
          : [...selectedItems, feature];
        onChange(newSelection);
      }
    };

    if (isLoading) {
      return (
        <div className={`mb-6 ${className}`} data-testid={testId}>
          <h3 className="text-lg font-semibold mb-3 text-rd-blue-dark">
            {title}
          </h3>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rd-cyan mr-3"></div>
            <span className="text-rd-gray">Carregando funcionalidades...</span>
          </div>
        </div>
      );
    }

    if (features.length === 0) {
      return (
        <div className={`mb-6 ${className}`} data-testid={testId}>
          <h3 className="text-lg font-semibold mb-3 text-rd-blue-dark">
            {title}
          </h3>
          <p className="text-rd-gray text-sm italic">
            Nenhuma funcionalidade disponível no momento.
          </p>
        </div>
      );
    }

    return (
      <fieldset className={`mb-6 ${className}`} data-testid={testId}>
        <legend className="text-lg font-semibold mb-3 text-rd-blue-dark">
          {title}
          {required && <span className="text-rd-error ml-1">*</span>}
          {selectionCount > 0 && (
            <span className="ml-2 text-sm text-rd-cyan font-normal">
              ({selectionCount} selecionada{selectionCount !== 1 ? "s" : ""})
            </span>
          )}
        </legend>

        <div className="grid grid-cols-1 gap-3">
          {features.map((feature, index) => (
            <Input
              key={feature.id || feature}
              type="checkbox"
              name="features"
              value={feature}
              checked={isSelected(feature)}
              onChange={() => handleFeatureChange(feature)}
              disabled={disabled}
              className="p-2 rounded-lg border border-rd-gray hover:border-rd-cyan transition-colors hover:bg-rd-cyan-light"
              inputClassName="text-rd-cyan focus:ring-rd-cyan"
              labelClassName="text-rd-blue-dark font-medium"
              data-testid={`feature-${index}`}
            >
              {feature.label || feature.name || feature}
            </Input>
          ))}
        </div>
      </fieldset>
    );
  }
);

FeaturesField.propTypes = {
  features: PropTypes.array.isRequired,
  initialSelected: PropTypes.array,
  onChange: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  "data-testid": PropTypes.string,
};

FeaturesField.displayName = "FeaturesField";

export default FeaturesField;
