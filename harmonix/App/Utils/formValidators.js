
export const trimFields = (fields) => {
    return fields.map((field) => field.trim());
  };
  
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
    export const resetFields = (setFieldFunctions) => {
        setFieldFunctions.forEach((setField) => setField({ email: "", password: "", rePassword: "",newPassword:"" }));
      };
export const validateEmail = (email, setErrors) => {
    if (!email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "form.errors.required-field",
      }));
    } else if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "form.errors.invalid-email",
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors, email: ''
      }));
    }
  };
  
  export const validatePassword = (password, setErrors) => {
  
    if (!password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "form.errors.required-field",
        newPassword: "form.errors.required-field",
  
      }));
    } else if (!passwordRegex.test(password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "form.errors.password-format",
        newPassword: "form.errors.password-format",
      }));
  
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
        newPassword: "",
      }));
    }
  };