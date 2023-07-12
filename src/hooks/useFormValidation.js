import { useState, useCallback } from 'react';

const useFormValidation = () => {
  const [value, setValue] = useState({});
  const [error, setError] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [input, setInput] = useState({});

  const handleChange = evt => {
    const { name, value, validationMessage, form, valid: isValid } = evt.target;

    setValue(obj => {
      return { ...obj, [name]: value };
    });
    setError(err => {
      return { ...err, [name]: validationMessage };
    });
    setInput(obj => {
      return { ...obj, [name]: isValid };
    });
    setIsValid(form.checkValidity());
  };

  const resetValidation = useCallback(() => {
    setValue({});
    setError({});
    setIsValid(false);
    setInput({});
  }, []);

  return {
    value,
    error,
    isValid,
    input,
    handleChange,
    resetValidation
  };
};

export default useFormValidation;
