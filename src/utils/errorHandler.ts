import { IErrorHandler } from "../interfaces/error.interface";

export class ErrorHandler extends Error implements IErrorHandler {
  status: number;
  constructor(message: string, status: number) {
    super(message), (this.status = status);

    Error.captureStackTrace(this, this.constructor);
  }
}
