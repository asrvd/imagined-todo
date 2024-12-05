import { z } from "zod";

export const createTodoSchema = z.object({
  id: z.string().min(1, { message: "Id is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  completed: z.boolean().optional().default(false),
  label: z.enum(["personal", "work", "shopping", "other"]).optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  notes: z.string().optional(),
  createdAt: z.string().min(1, { message: "Created at is required" }),
});

export const updateTodoSchema = createTodoSchema
  .partial()
  .required({ id: true });

export const deleteTodoSchema = z.object({ id: z.string().uuid() });
