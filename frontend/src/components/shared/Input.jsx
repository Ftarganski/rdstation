/**
 * Componente de input aprimorado para checkbox e radio
 * Segue o princípio da responsabilidade única e é extensível
 * Melhora a acessibilidade e semântica
 */

import PropTypes from "prop-types";
import { forwardRef, memo } from "react";

/**
 * Componente Input para checkbox e radio buttons
 * @param {Object} props - Propriedades do componente
 * @param {Object} ref - Referência para o elemento
 */
const Input = memo(
  forwardRef(
    (
      {
        type = "checkbox",
        value,
        name,
        checked = false,
        onChange,
        children,
        className = "",
        inputClassName = "",
        labelClassName = "",
        disabled = false,
        required = false,
        "aria-describedby": ariaDescribedBy,
        "data-testid": testId,
        ...props
      },
      ref
    ) => {
      const inputId = `${name || "input"}-${value || "default"}`;

      const baseInputClasses =
        type === "radio"
          ? "form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          : "form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300";

      const handleChange = (event) => {
        if (onChange && !disabled) {
          onChange(event);
        }
      };

      return (
        <label
          htmlFor={inputId}
          className={`flex items-center cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
        >
          <input
            ref={ref}
            id={inputId}
            type={type}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-describedby={ariaDescribedBy}
            data-testid={testId}
            className={`${baseInputClasses} ${inputClassName} ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            {...props}
          />
          {children && (
            <span
              className={`ml-2 select-none ${labelClassName} ${
                disabled ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {children}
            </span>
          )}
        </label>
      );
    }
  )
);

Input.propTypes = {
  type: PropTypes.oneOf(["checkbox", "radio"]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  "aria-describedby": PropTypes.string,
  "data-testid": PropTypes.string,
};

Input.displayName = "Input";

export default Input;
