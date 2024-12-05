'use client';

import { Todo } from '@prisma/client';
import { TodoItem } from './todo-item';
import { useOptimistic, useState } from 'react';
import { AddTodoForm } from './add-todo-form';
import useSWR from 'swr';
import { getTodosAction } from '../_actions';

export interface TodoListProps {
  todos: Todo[];
}

export function TodoList({ todos: _todos }: TodoListProps) {
  const { data: todos, mutate } = useSWR('getTodosAction', getTodosAction, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    revalidateOnMount: false,
    refreshWhenHidden: false,
    fallbackData: _todos,
  });

  const handleCreate = (newTodo: Todo) => {
    console.log(newTodo);
    mutate();
  };

  return (
    <>
      <AddTodoForm onCreate={handleCreate} />
      <ul className="w-full space-y-2 mt-4">{todos?.map(todo => <TodoItem key={todo.id} todo={todo} />)}</ul>
    </>
  );
}
