'use server';

import { addTodoSchema, toggleTodoSchema } from './schema';
import prisma from '@/lib/prisma';
import { actionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const getTodosAction = async () => {
  return await prisma.todo.findMany();
};

export const addTodoAction = actionClient.schema(addTodoSchema).action(async ({ parsedInput: data }) => {
  const existingTodo = await prisma.todo.findFirst({ where: { title: data.newTodo } });

  if (existingTodo) {
    return {
      success: false,
      error: 'The todo already exists!',
    };
  }

  const newTodo = await prisma.todo.create({
    data: {
      title: data.newTodo,
    },
  });

  return {
    success: true,
    newTodo,
  };
});

export const deleteTodoAction = async (id: string) => {
  await prisma.todo.delete({ where: { id } });
  revalidatePath('/');
};

export const toggleTodoAction = async (data: z.infer<typeof toggleTodoSchema>) => {
  await prisma.todo.update({ where: { id: data.id }, data: { completed: data.completed } });
};
