import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "What is your intention?").max(255),
  horizonType: z.enum(["today", "week", "later"]),
});
