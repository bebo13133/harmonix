import { useState, useCallback } from 'react';
import { trimFields, validateForm } from '../Utils/formValidators';

export const useForm = (initialValues, onSubmitHandler) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
  
    const onChangeHandler = useCallback((name, value) => {
        setValues(prevValues => ({ ...prevValues, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }, []);
  
    const handleTrimFields = useCallback(() => {
        const trimmedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, value.trim()])
        );
        setValues(trimmedValues);
    }, [values]);
  
    const validate = useCallback(() => {
        const newErrors = validateForm(values);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [values]);
  
    const onSubmit = useCallback(() => {
        handleTrimFields();
  
        if (validate()) {
            onSubmitHandler(values);
        }
    }, [handleTrimFields, validate, values, onSubmitHandler]);
  
    return {
        values,
        errors,
        onChangeHandler,
        onSubmit,
    };
};