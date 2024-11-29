'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Todo } from '@prisma/client';
import { useOptimistic, useTransition, startTransition as reactStartTransition } from 'react';
import { deleteTodoAction, toggleTodoAction } from '../_actions';
import { DeleteIcon, Loader2 } from 'lucide-react';

export interface TodoItemProps {
  todo: Todo;
}
export function TodoItem({ todo }: TodoItemProps) {
  const [optimisticIsCompleted, setOptimisticIsCompleted] = useOptimistic(
    todo.completed,
    (_, newValue: boolean) => newValue,
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteTodoAction(todo.id);
    });
  };

  const handleToggle = async (isCompleted: boolean) => {
    reactStartTransition(() => {
      setOptimisticIsCompleted(isCompleted);
    });
    toggleTodoAction({ id: todo.id, completed: isCompleted });
  };

  return (
    <li className="flex items-center gap-2 p-2 border ring-1 ring-inset ring-border rounded-md cursor-pointer">
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Checkbox checked={optimisticIsCompleted} onCheckedChange={checked => handleToggle(checked as boolean)} />
      )}
      <div className="flex items-center gap-2 w-full justify-between">
        {todo.title}
        <DeleteIcon className="w-4 h-4 text-red-500" onClick={handleDelete} />
      </div>
    </li>
  );
}
