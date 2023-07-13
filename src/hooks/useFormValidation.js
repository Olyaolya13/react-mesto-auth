import { useState, useCallback } from 'react';

const useFormValidation = () => {
  const [value, setValue] = useState({});
  const [error, setError] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isInputValid, setIsInputValid] = useState({});

  const handleChange = evt => {
    const { name, value, validationMessage, form, valid: isValid } = evt.target;

    setValue(obj => {
      return { ...obj, [name]: value };
    });
    setError(err => {
      return { ...err, [name]: validationMessage };
    });
    setIsInputValid(obj => {
      return { ...obj, [name]: isValid };
    });
    setIsValid(form.checkValidity());
  };

  const resetValidation = useCallback(() => {
    setValue({});
    setError({});
    setIsValid(false);
    setIsInputValid({});
  }, []);

  return {
    value,
    error,
    isValid,
    isInputValid,
    handleChange,
    resetValidation
  };
};

export default useFormValidation;
