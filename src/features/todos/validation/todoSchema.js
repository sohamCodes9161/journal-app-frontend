import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),

  description: z.string().optional(),

  priority: z.enum(["low", "medium", "high"]),

  horizonType: z.enum(["today", "week", "long-term"]),
});
