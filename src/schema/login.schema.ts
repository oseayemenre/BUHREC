import z from "zod";

export const loginSchema = z.object({
  username: z
    .string({
      required_error: "Username cannot be empty",
    })
    .min(1),
  password: z
    .string({
      required_error: "Password cannot be empty",
    })
    .min(1),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
