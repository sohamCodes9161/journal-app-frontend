import { z } from "zod";

export const createJournalSchema = z.object({
  title: z.string().min(1, "Title is required"),

  mood: z.string().min(1, "Mood is required"),

  category: z.string().min(1, "Category is required"),
});
