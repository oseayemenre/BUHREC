export interface ICreateAccountResponse {
  status: "success";
  message: string;
  accessToken: string;
  data: Record<string, any>;
}
