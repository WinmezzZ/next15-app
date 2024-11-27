'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Todo } from '@prisma/client';
import { useTransition } from 'react';
import { deleteTodoAction, toggleTodoAction } from '../_actions';
import { DeleteIcon, Loader2 } from 'lucide-react';

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

  const handleDelete = () => {
    startTransition(() => {
      deleteTodoAction(todo.id);
    });
  };

  return (
    <li className="flex items-center gap-2 p-2 border ring-1 ring-inset ring-border rounded-md cursor-pointer">
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Checkbox checked={todo.completed} onCheckedChange={handleCheckboxChange} />
      )}
      <div className="flex items-center gap-2 w-full justify-between">
        {todo.title}
        <DeleteIcon className="w-4 h-4 text-red-500" onClick={handleDelete} />
      </div>
    </li>
  );
}
