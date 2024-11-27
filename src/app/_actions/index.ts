'use server';

import { actionClient } from '@/lib/safe-action';
import { addTodoSchema, deleteTodoSchema, toggleTodoSchema } from './schema';
import prisma from '@/lib/prisma';
import { returnValidationErrors } from 'next-safe-action';
import { revalidatePath } from 'next/cache';

export const addTodoAction = actionClient.schema(addTodoSchema).action(async ({ parsedInput }) => {
  const existingTodo = await prisma.todo.findFirst({ where: { title: parsedInput.newTodo } });

  if (existingTodo) {
    returnValidationErrors(addTodoSchema, {
      newTodo: {
        _errors: ['The todo already exists!'],
      },
    });
  }

  await prisma.todo.create({ data: { title: parsedInput.newTodo } });
  revalidatePath('/');

  return {
    success: true,
    newTodo: parsedInput.newTodo,
  };
});

export const deleteTodoAction = actionClient.schema(deleteTodoSchema).action(async ({ parsedInput }) => {
  await prisma.todo.delete({ where: { id: parsedInput.id } });
  revalidatePath('/');
});

export const toggleTodoAction = actionClient.schema(toggleTodoSchema).action(async ({ parsedInput }) => {
  await prisma.todo.update({ where: { id: parsedInput.id }, data: { completed: parsedInput.completed } });
  revalidatePath('/');
});
