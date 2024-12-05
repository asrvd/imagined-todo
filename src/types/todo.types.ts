import { createTodoSchema } from "@/schemas/todo.schema";
import { z } from "zod";

export type Todo = z.infer<typeof createTodoSchema>;
