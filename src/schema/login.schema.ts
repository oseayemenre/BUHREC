import z from "zod";

export const loginSchema = z.object({
  username: z.string({
    required_error: "Username cannot be empty",
  }),
  password: z.string({
    required_error: "Password cannot be empty",
  }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
