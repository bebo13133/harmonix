import { useState } from 'react';
import { trimFields, validateEmail, validatePassword } from '../Utils/formValidators';

export const useForm = (initialValues, onSubmitHandler) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
  
    const onChangeHandler = (name, value) => {
      setValues((state) => ({ ...state, [name]: value }));
    };
  
    const handleTrimFields = () => {
      const { email = "", password = "" } = values;
      const [trimmedEmail, trimmedPassword] = trimFields([email, password]);
      setValues({
        email: trimmedEmail,
        password: trimmedPassword,
      });
    };
  
    const validate = () => {
      const newErrors = {};
  
      if (!values.email) {
        newErrors.email = 'Email is required';
      } else {
        validateEmail(values.email, (error) => {
          if (error) newErrors.email = error;
        });
      }
  
      if (!values.password) {
        newErrors.password = 'Password is required';
      } else {
        validatePassword(values.password, (error) => {
          if (error) newErrors.password = error;
        });
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const onSubmit = () => {
      handleTrimFields();
  
      if (validate()) {
        onSubmitHandler(values);
      }
    };
  
    return {
      values,
      errors,
      onChangeHandler,
      onSubmit,
    };
  };