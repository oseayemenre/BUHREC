import z from "zod";
import { Level, Program, Role } from "@prisma/client";

export const registerSchema = z.object({
  firstname: z
    .string({
      required_error: "Name cannot be empty",
    })
    .min(1),
  lastname: z
    .string({
      required_error: "Name cannot be empty",
    })
    .min(1),
  email: z
    .string({
      required_error: "Email cannot be empty",
    })
    .email()
    .min(1),

  role: z.nativeEnum(Role),

  level: z.nativeEnum(Level),

  program: z.nativeEnum(Program),
});

export type TRegisterSchema = z.infer<typeof registerSchema> & {
  username: string;
  password: string;
};
