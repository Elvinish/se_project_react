import { useState, useCallback } from "react";

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const resetForm = useCallback(() => {
    setValues(initialValues); // ✅ Memoized function prevents re-renders
  }, [initialValues]);

  return { values, handleChange, resetForm, setValues };
}
