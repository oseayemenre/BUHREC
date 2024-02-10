export interface IErrorMiddleWare {
  status: "failed";
  message: string;
  stackTrace: string | null | undefined;
}
