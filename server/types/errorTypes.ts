export interface FieldError {
  field: string;
  value: string;
  message: string;
}

interface dbErrorDetails {
  message: string;
  statusCode: number;
}

export interface dbErrors {
  [key: string]: dbErrorDetails;
}
