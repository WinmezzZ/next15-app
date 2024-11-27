'use client';

import { useHookFormOptimisticAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { addTodoSchema } from '../_actions/schema';
import { addTodoAction } from '../_actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Todo } from '@prisma/client';

type Props = {
  todos: Todo[];
};

export function AddTodoForm({ todos }: Props) {
  const { form, handleSubmitWithAction, resetFormAndAction } = useHookFormOptimisticAction(
    addTodoAction,
    zodResolver(addTodoSchema),
    {
      actionProps: {
        currentState: {
          todos,
        },
        onSuccess: () => {
          resetFormAndAction();
        },
        updateFn: (state, input) => {
          return {
            todos: [...state.todos, { id: '1', title: input.newTodo, completed: false }],
          };
        },
      },
      formProps: {
        mode: 'onChange',
      },
      errorMapProps: {},
    },
  );

  return (
    <form onSubmit={handleSubmitWithAction} className="flex flex-col space-y-4">
      <Input {...form.register('newTodo')} />
      {form.formState.errors.newTodo ? <p>{form.formState.errors.newTodo.message}</p> : null}
      <Button type="submit">Add Todo</Button>
      {form.formState.errors.root ? <p>{form.formState.errors.root.message}</p> : null}
    </form>
  );
}
