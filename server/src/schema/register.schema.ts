import z from "zod";

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
});

export type TRegisterSchema = z.infer<typeof registerSchema> & {
  username: string;
  password: string;
};
