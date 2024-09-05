class CustomError extends Error {
  public statusCode: number;
  public details: string;

  constructor(message: string, statusCode: number = 400, details: string) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export default CustomError;
