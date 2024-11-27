'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Todo } from '@prisma/client';
import { useTransition } from 'react';
import { toggleTodoAction } from '../_actions';

export interface TodoItemProps {
  todo: Todo;
}
export function TodoItem({ todo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleCheckboxChange = (checked: boolean) => {
    startTransition(() => {
      toggleTodoAction({ id: todo.id, completed: checked });
    });
  };

  return (
    <li className="flex items-center gap-2">
      <Checkbox disabled={isPending} checked={todo.completed} onCheckedChange={handleCheckboxChange} />
      {todo.title}
    </li>
  );
}
