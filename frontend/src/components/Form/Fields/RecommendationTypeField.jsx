/**
 * Componente especializado para seleção de tipo de recomendação
 * Segue o princípio SRP e utiliza constantes centralizadas
 * Extensível e configurável
 */

import { Input } from "@/components";
import {
  RECOMMENDATION_TYPES,
  RECOMMENDATION_TYPE_LABELS,
} from "@/constants/formConstants";
import { useSingleSelection } from "@/hooks";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Componente para seleção do tipo de recomendação
 * @param {Object} props - Propriedades do componente
 */
const RecommendationTypeField = memo(
  ({
    initialValue = "",
    onChange,
    title = "Tipo de Recomendação",
    className = "",
    disabled = false,
    required = false,
    "data-testid": testId = "recommendation-type-field",
  }) => {
    const { selectedValue, selectValue, isSelected } =
      useSingleSelection(initialValue);

    const handleTypeChange = (type) => {
      if (disabled) return;

      selectValue(type);

      // Notifica o componente pai sobre a mudança
      if (onChange) {
        onChange(type);
      }
    };

    const recommendationOptions = [
      {
        value: RECOMMENDATION_TYPES.SINGLE,
        label: RECOMMENDATION_TYPE_LABELS[RECOMMENDATION_TYPES.SINGLE],
        description: "Recomenda apenas o produto mais adequado",
      },
      {
        value: RECOMMENDATION_TYPES.MULTIPLE,
        label: RECOMMENDATION_TYPE_LABELS[RECOMMENDATION_TYPES.MULTIPLE],
        description: "Recomenda todos os produtos compatíveis",
      },
    ];

    return (
      <fieldset className={`mb-6 ${className}`} data-testid={testId}>
        <legend className="text-lg font-semibold mb-3 text-rd-blue-dark">
          {title}
          {required && <span className="text-rd-error ml-1">*</span>}
          {selectedValue && (
            <span className="ml-2 text-sm text-rd-cyan font-normal">
              ({RECOMMENDATION_TYPE_LABELS[selectedValue]})
            </span>
          )}
        </legend>

        <div className="grid grid-cols-1 gap-4">
          {recommendationOptions.map((option, index) => (
            <div
              key={option.value}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected(option.value)
                  ? "border-rd-cyan bg-rd-cyan-light shadow-md"
                  : "border-rd-gray hover:border-rd-cyan hover:bg-rd-sky-light"
              }`}
              onClick={() => handleTypeChange(option.value)}
            >
              <Input
                type="radio"
                name="recommendationType"
                value={option.value}
                checked={isSelected(option.value)}
                onChange={() => handleTypeChange(option.value)}
                disabled={disabled}
                className="items-start"
                inputClassName="text-rd-cyan focus:ring-rd-cyan mt-1"
                labelClassName="text-rd-blue-dark font-medium"
                data-testid={`recommendation-type-${index}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-rd-blue-dark">
                    {option.label}
                  </span>
                  <span className="text-sm text-rd-gray mt-1">
                    {option.description}
                  </span>
                </div>
              </Input>
            </div>
          ))}
        </div>
      </fieldset>
    );
  }
);

RecommendationTypeField.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  "data-testid": PropTypes.string,
};

RecommendationTypeField.displayName = "RecommendationTypeField";

export default RecommendationTypeField;
