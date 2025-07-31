import { useCallback, useState } from 'react';

/**
 * Hook para gerenciar estado de formulários.
 * @param {object} initialState - Estado inicial do formulário.
 */
const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return { formData, handleChange };
};

export default useForm;
