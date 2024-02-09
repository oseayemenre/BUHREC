import { type Request, type Response } from "express";
import { type TRegisterSchema } from "../schema/register.schema";
import { catchAsync } from "../utils/catchAsync";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../services/auth.services";
import { ErrorHandler } from "../utils/errorHandler";
import { generateToken } from "../utils/jwt";
import { ACCESS_SECRET } from "../secret";
import { type TLoginSchema } from "../schema/login.schema";
import { type ICreateAccountResponse } from "../interfaces/createAccountResponse.interface";
import { REFRESH_SECRET } from "../secret";
import { type ILoginResponse } from "../interfaces/loginResponse.interface";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendmail } from "../utils/sendMail";
import { prisma } from "../utils/prisma";
import { IRequestMiddleWare } from "../interfaces/responseMiddleWare,interface";

export const createAccount = catchAsync(
  async (
    req: Request<{}, {}, TRegisterSchema>,
    res: Response<ICreateAccountResponse>
  ) => {
    const body = req.body;
    const { name, email } = body;

    const user = await findUserByEmail(email);
    if (user) throw new ErrorHandler("User already exists", 409);

    const randomdigits = Math.floor(1000 + Math.random() * 8999);
    const username = `${name.split(/\s+/)[0].toLowerCase()}${randomdigits}`;

    const randomPassword = uuidv4().split("-");
    const password = randomPassword[randomPassword.length - 1];
    const hashedPassword = await bcrypt.hash(password, 12);

    await sendmail({ name, email, username, password });

    const data = await createUser({
      name,
      email,
      username,
      password: hashedPassword,
    });

    const accessToken = generateToken({ id: data.id }, ACCESS_SECRET);
    res.cookie("access_token", accessToken, { maxAge: 15 * 60 * 1000 });

    return res.status(201).json({
      status: "success",
      message: "User succesfully created",
      accessToken,
      data,
    });
  }
);

export const login = catchAsync(
  async (req: Request<{}, {}, TLoginSchema>, res: Response<ILoginResponse>) => {
    const body = req.body;
    const { username, password } = body;

    const user = await findUserByUsername(username);
    if (!user) throw new ErrorHandler("User not found", 404);

    const confirmPassword = await bcrypt.compare(password, user.password);
    if (!confirmPassword) throw new ErrorHandler("Invalid credentials", 401);

    const accessToken = generateToken({ id: user.id }, ACCESS_SECRET);
    const refreshToken = generateToken({ id: user.id }, REFRESH_SECRET);
    res.cookie("access_token", accessToken, { maxAge: 15 * 60 * 1000 });
    res.cookie("refresh_token", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      message: "Access granted",
      accessToken,
      refreshToken,
    });
  }
);

export const createNewAccessToken = catchAsync(
  async (req: Request, res: Response<ILoginResponse>) => {
    const token: string = req.cookies.refresh_token;
    if (!token) throw new ErrorHandler("Token not found", 404);
    const decoded = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
    if (!decoded) throw new ErrorHandler("Token could not be validated", 401);

    const accessToken = generateToken({ id: decoded.id }, ACCESS_SECRET);
    const refreshToken = generateToken({ id: decoded.id }, REFRESH_SECRET);
    res.cookie("access_token", accessToken, { maxAge: 25 * 60 * 1000 });
    res.cookie("refresh_token", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Token succesfully refreshed",
      accessToken,
      refreshToken,
    });
  }
);

export const updateUserPassword = catchAsync(
  async (req: IRequestMiddleWare, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.user } });
    if (!user) throw new ErrorHandler("User doesn't exist", 404);

    const body: IRequestMiddleWare = req.body;
    const { password } = body;

    console.log(password);
  }
);
