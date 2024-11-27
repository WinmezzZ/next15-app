import { z } from 'zod';

export const addTodoSchema = z.object({
  newTodo: z.string().min(1).max(200),
});

export const deleteTodoSchema = z.object({
  id: z.string(),
});

export const toggleTodoSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
});
