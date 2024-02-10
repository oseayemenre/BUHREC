export interface ILoginResponse {
  status: "success";
  message: string;
  accessToken: string;
  refreshToken: string;
}
