'use server';

import { addTodoSchema, toggleTodoSchema } from './schema';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const addTodoAction = async (data: z.infer<typeof addTodoSchema>) => {
  const validatedFields = addTodoSchema.safeParse(data);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      error: Object.values(fieldErrors)[0][0],
    };
  }

  const existingTodo = await prisma.todo.findFirst({ where: { title: data.newTodo } });

  if (existingTodo) {
    return {
      error: 'The todo already exists!',
    };
  }

  await prisma.todo.create({
    data: {
      title: data.newTodo,
    },
  });
  revalidatePath('/');

  return {
    success: true,
    newTodo: data.newTodo,
  };
};

export const deleteTodoAction = async (id: string) => {
  await prisma.todo.delete({ where: { id } });
  revalidatePath('/');
};

export const toggleTodoAction = async (data: z.infer<typeof toggleTodoSchema>) => {
  await prisma.todo.update({ where: { id: data.id }, data: { completed: data.completed } });
};
