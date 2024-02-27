import { type Request } from "express";

export interface IAuthResponse {
  status: "success";
  message: string;
}

export interface ICreateAccountResponse {
  status: "success";
  message: string;
  accessToken: string;
  data: Record<string, any>;
}

export interface ILoginResponse {
  status: "success";
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface IUpdateUserRequest extends Request {
  user?: string;
  password: string;
}
