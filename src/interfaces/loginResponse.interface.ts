export interface ILoginResponse {
  status: "success" | "failed";
  message: string;
  accessToken: string;
  refreshToken: string;
}
