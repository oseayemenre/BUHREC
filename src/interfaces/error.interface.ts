export interface IErrorHandler {
  status: number;
  message: string;
}

export interface IErrorMiddleWare {
  status: "failed";
  message: string;
  stackTrace: string | null | undefined;
}
