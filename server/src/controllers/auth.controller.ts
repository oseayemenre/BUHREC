import { type Request, type Response } from "express";
import { type TRegisterSchema } from "../schema/register.schema";
import { catchAsync } from "../utils/catchAsync";
import {
  createUser,
  deleteReviewerOrSubAdmin,
  findAllAdmins,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  getAllReviewersByCourse,
  getSubAdmins,
  updateAvatar,
  updateUserPass,
} from "../services/auth.services";
import { ErrorHandler } from "../utils/errorHandler";
import { generateToken } from "../utils/jwt";
import { ACCESS_SECRET } from "../secret";
import { type TLoginSchema } from "../schema/login.schema";
import { type ICreateAccountResponse } from "../interfaces/auth.interface";
import { REFRESH_SECRET } from "../secret";
import { type ILoginResponse } from "../interfaces/auth.interface";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendmail } from "../utils/sendMail";
import { prisma } from "../utils/prisma";
import { type IUpdateUserRequest } from "../interfaces/auth.interface";
import { type IAuthResponse } from "../interfaces/auth.interface";
import { cloudinary } from "../utils/cloudinary";
import { Program, User } from "@prisma/client";
import { IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";

export const createAccount = catchAsync(
  async (
    req: Request<{}, {}, TRegisterSchema>,
    res: Response<ICreateAccountResponse>
  ) => {
    const body = req.body;
    const { firstname, lastname, email, role, level, program } = body;

    const user = await findUserByEmail(email);
    if (user) throw new ErrorHandler("User already exists", 409);

    const findAdmin = await findAllAdmins();

    if (role === "ADMIN" && findAdmin.length > 0)
      throw new ErrorHandler("Admin already exists", 400);

    const subAdmins = await getSubAdmins();

    const subAdminCourse = subAdmins.findIndex(
      (subAdmin) => subAdmin.program === program
    );

    if (role === "SUB_ADMIN" && subAdminCourse >= 0)
      throw new ErrorHandler("A sub-admin for this course already exists", 400);

    const randomdigits = Math.floor(1000 + Math.random() * 8999);
    const username = `${lastname.split(/\s+/)[0].toLowerCase()}${randomdigits}`;

    const randomPassword = uuidv4().split("-");
    const password = randomPassword[randomPassword.length - 1];
    const hashedPassword = await bcrypt.hash(password, 12);

    await sendmail({ firstname, lastname, email, username, password });

    const data = await createUser({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
      role,
      level,
      program,
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
      user: user as User,
    });
  }
);

export const createNewAccessToken = catchAsync(
  async (req: Request, res: Response<Omit<ILoginResponse, "user">>) => {
    const token: string = req.cookies.refresh_token;
    if (!token) throw new ErrorHandler("Token not found", 404);
    const decoded = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
    if (!decoded) throw new ErrorHandler("Token could not be validated", 401);

    const accessToken = generateToken({ id: decoded.id }, ACCESS_SECRET);
    const refreshToken = generateToken({ id: decoded.id }, REFRESH_SECRET);
    res.cookie("access_token", accessToken, {
      maxAge: 25 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("refresh_token", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
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
  async (req: IUpdateUserRequest, res: Response<IAuthResponse>) => {
    const user = await findUserById(req.user as string);
    if (!user) throw new ErrorHandler("User doesn't exist", 404);

    const body: IUpdateUserRequest = req.body;
    const { password } = body;

    console.log(password);
    const hashPassword = await bcrypt.hash(password, 12);

    await updateUserPass(user.password, hashPassword);

    res.status(200).json({
      status: "success",
      message: "Password succesfuly updated",
    });
  }
);

export const deleteAccount = catchAsync(
  async (req: IUpdateUserRequest, res: Response<IAuthResponse>) => {
    const user = await findUserById(req.user as string);
    if (!user) throw new ErrorHandler("User doesn't exist", 404);

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    res.cookie("access_token", "", {
      httpOnly: true,
      maxAge: 0,
    });

    res.status(200).json({
      status: "success",
      message: "User succesfully deleted",
    });
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response<IAuthResponse>) => {
    res.cookie("access_token", "", {
      httpOnly: true,
      maxAge: 0,
    });

    res.status(200).json({
      status: "success",
      message: "User logged out",
    });
  }
);

export const deleteReviewerAccount = catchAsync(
  async (req: IRequestMiddleWare, res: Response<IAuthResponse>) => {
    const { id } = req.params as { id: string };

    const user = await findUserById(id as string);

    if (user?.role !== "REVIEWER")
      throw new ErrorHandler("User could not be deleted", 400);

    await deleteReviewerOrSubAdmin(id);

    res.status(200).json({
      status: "success",
      message: `${user.lastname} ${user.firstname} has been deleted`,
    });
  }
);

export const updateProfilePicture = catchAsync(
  async (req: IUpdateUserRequest, res: Response<{ user: User }>) => {
    const { image } = req.body as { image: string };

    const avatar = await cloudinary.uploader.upload(image, {
      folder: "buhrec",
    });

    const user = await updateAvatar({
      id: req.user as string,
      avatar: avatar.secure_url,
    });

    res.status(200).json({
      user,
    });
  }
);

export const getAllSubAdmins = catchAsync(
  async (
    req: Request,
    res: Response<{ status: string; sub_admins: User[] }>
  ) => {
    const sub_admins = await getSubAdmins();

    res.status(200).json({
      status: "success",
      sub_admins,
    });
  }
);

export const getAllReviewers = catchAsync(
  async (
    req: Request<{ program: Program }>,
    res: Response<{ status: string; researchers: User[] }>
  ) => {
    const { program } = req.params;

    const researchers = await getAllReviewersByCourse(program);

    res.status(200).json({
      status: "success",
      researchers,
    });
  }
);

export const deleteSubAdminAccount = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const user = await findUserById(id as string);

    if (user?.role !== "SUB_ADMIN")
      throw new ErrorHandler("User could not be deleted", 400);

    await deleteReviewerOrSubAdmin(id);

    res.status(200).json({
      status: "success",
      message: `${user.lastname} ${user.firstname} has been deleted`,
    });
  }
);

export const getProfile = async (
  req: IRequestMiddleWare,
  res: Response<{ status: string; user: User }>
) => {
  const user = await findUserById(req.user as string);

  res.status(200).json({
    status: "success",
    user: user as User,
  });
};
