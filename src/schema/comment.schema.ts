import z from "zod";

export const commentSchema = z.object({
  message: z
    .string({
      required_error: "Message cannot be empty",
    })
    .min(1),
});

export type TCommentSchema = z.infer<typeof commentSchema>;
