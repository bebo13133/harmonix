export const trimFields = (fields) => {
  return fields.map((field) => field.trim());
};

// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export const resetFields = (setFieldFunctions) => {
  setFieldFunctions.forEach((setField) => setField({ email: "", password: "", }));
};

export const validateEmail = (email) => {
  if (!email) {
      return "form.errors.required-field";
  } else if (!emailRegex.test(email)) {
      return "form.errors.invalid-email";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
      return "form.errors.required-field";
  } else if (!passwordRegex.test(password)) {
      return "form.errors.password-format";
  }
  return null;
};

export const validateForm = (values) => {
  const errors = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) {
      errors.password = passwordError;
  }

  return errors;
};