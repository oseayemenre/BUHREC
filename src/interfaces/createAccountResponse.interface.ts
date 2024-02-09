export interface ICreateAccountResponse {
  status: "success" | "failed";
  message: string;
  accessToken: string;
  data: Record<string, any>;
}
