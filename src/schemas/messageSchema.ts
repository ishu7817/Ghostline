import z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Mystery, not minimalism...Minimum 10 characters")
    
});
