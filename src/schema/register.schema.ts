import z from "zod";

export const registerSchema = z.object({
  name: z.string({
    required_error: "Name cannot be empty",
  }),
  email: z
    .string({
      required_error: "Email cannot be empty",
    })
    .email(),
});

export type TRegisterSchema = z.infer<typeof registerSchema> & {
  username: string;
  password: string;
};
