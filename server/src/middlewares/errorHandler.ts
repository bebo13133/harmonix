import { FieldError, dbErrors } from './../../types/errorTypes';
import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError, DatabaseError } from 'sequelize';
import { TokenExpiredError } from 'jsonwebtoken';
import CustomError from '../utils/customError';
import { Request, Response, NextFunction } from 'express';

function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  let message: string = `Something went wrong! ${error.message}`;
  let statusCode: number = error.statusCode || 500;
  let details = error.details || 'No details provided';

  if (error instanceof CustomError) {
    message = error.message;
  } else if (error instanceof UniqueConstraintError) {
    const fieldErrors: FieldError[] = error.errors.map((err: any) => ({
      field: err.path,
      value: err.value,
      message: `${err.path.charAt(0).toUpperCase() + err.path.slice(1)} is already taken`,
    }));
    message = 'Unique constraint violation';
    details = fieldErrors;
    statusCode = 409;
  } else if (error instanceof ForeignKeyConstraintError || error instanceof DatabaseError) {
    const errorCode = (error as any).original.code;
    const dbError = dbErrors[errorCode];
    if (dbError) {
      message = dbError.message;
      statusCode = dbError.statusCode;
      details = error.message;
    }
  } else if (error instanceof ValidationError) {
    const fieldErrors: FieldError[] = error.errors.map((err: any) => ({
      field: err.path,
      value: err.value,
      message: err.message,
    }));
    message = 'Validation error';
    details = fieldErrors;
    statusCode = 400;
  } else if (error instanceof TokenExpiredError) {
    message = 'Token expired';
    statusCode = 401;
  }
  error.details
    ? console.log(`Error: ${req.method} >> ${req.baseUrl}`, message, error.details)
    : console.log(`Error: ${req.method} >> ${req.baseUrl}`, message);
  res.status(statusCode).json({ message, statusCode, details });
}

const dbErrors: dbErrors = {
  1451: { message: 'Foreign key violation', statusCode: 409 },
  1048: { message: 'Not null violation', statusCode: 400 },
  3819: { message: 'Check violation', statusCode: 400 },
  1406: { message: 'String data too long', statusCode: 400 },
  1264: { message: 'Numeric value out of range', statusCode: 400 },
  1064: { message: 'Syntax error', statusCode: 400 },
  1305: { message: 'Undefined function', statusCode: 500 },
  1044: { message: 'Permission denied', statusCode: 403 },
  1366: { message: 'Invalid text representation', statusCode: 400 },
};

export default errorHandler;
