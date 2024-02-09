export interface IErrorMiddleWare {
  status: "success" | "failed";
  message: string;
  stackTrace: string | null | undefined;
}
