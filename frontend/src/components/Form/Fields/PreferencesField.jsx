/**
 * Componente especializado para seleção de preferências
 * Segue o princípio SRP e utiliza composição
 * Extensível e reutilizável
 */

import PropTypes from "prop-types";
import { memo } from "react";
import { useMultipleSelection } from "../../../hooks";
import { Input } from "../../components";

/**
 * Componente para seleção múltipla de preferências
 * @param {Object} props - Propriedades do componente
 */
const PreferencesField = memo(
  ({
    preferences = [],
    initialSelected = [],
    onChange,
    title = "Preferências",
    className = "",
    isLoading = false,
    disabled = false,
    required = false,
    "data-testid": testId = "preferences-field",
  }) => {
    const { selectedItems, toggleSelection, isSelected, selectionCount } =
      useMultipleSelection(initialSelected);

    const handlePreferenceChange = (preference) => {
      if (disabled) return;

      toggleSelection(preference);

      // Notifica o componente pai sobre a mudança
      if (onChange) {
        const newSelection = isSelected(preference)
          ? selectedItems.filter((item) => item !== preference)
          : [...selectedItems, preference];
        onChange(newSelection);
      }
    };

    if (isLoading) {
      return (
        <div className={`mb-6 ${className}`} data-testid={testId}>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600">Carregando preferências...</span>
          </div>
        </div>
      );
    }

    if (preferences.length === 0) {
      return (
        <div className={`mb-6 ${className}`} data-testid={testId}>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm italic">
            Nenhuma preferência disponível no momento.
          </p>
        </div>
      );
    }

    return (
      <fieldset className={`mb-6 ${className}`} data-testid={testId}>
        <legend className="text-lg font-semibold mb-3 text-gray-800">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
          {selectionCount > 0 && (
            <span className="ml-2 text-sm text-blue-600 font-normal">
              ({selectionCount} selecionada{selectionCount !== 1 ? "s" : ""})
            </span>
          )}
        </legend>

        <div className="grid grid-cols-1 gap-3">
          {preferences.map((preference, index) => (
            <Input
              key={preference.id || preference}
              type="checkbox"
              name="preferences"
              value={preference}
              checked={isSelected(preference)}
              onChange={() => handlePreferenceChange(preference)}
              disabled={disabled}
              className="p-2 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors hover:bg-blue-50"
              inputClassName="text-blue-600 focus:ring-blue-500"
              labelClassName="text-gray-700 font-medium"
              data-testid={`preference-${index}`}
            >
              {preference.label || preference.name || preference}
            </Input>
          ))}
        </div>
      </fieldset>
    );
  }
);

PreferencesField.propTypes = {
  preferences: PropTypes.array.isRequired,
  initialSelected: PropTypes.array,
  onChange: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  "data-testid": PropTypes.string,
};

PreferencesField.displayName = "PreferencesField";

export default PreferencesField;
