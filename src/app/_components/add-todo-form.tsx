'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addTodoSchema } from '../_actions/schema';
import { addTodoAction } from '../_actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Todo } from '@prisma/client';

const initialValues: z.infer<typeof addTodoSchema> = {
  newTodo: '',
};

export interface AddTodoFormProps {
  onCreate?: (newTodo: Todo) => void;
}

export function AddTodoForm({ onCreate }: AddTodoFormProps) {
  const form = useForm<z.infer<typeof addTodoSchema>>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: initialValues,
  });

  const { control, formState, handleSubmit } = form;

  const onSubmit = async () => {
    handleSubmit(async values => {
      console.log(values);
      const result = await addTodoAction(values);
      if (result.error) {
        toast({ variant: 'destructive', title: result.error });
      }
    });
  };

  return (
    <Form {...form}>
      <form className="flex gap-2">
        <FormField
          control={control}
          name="newTodo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{formState.errors.newTodo?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="button" disabled={formState.isSubmitting} onClick={onSubmit}>
          {formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Add
        </Button>
      </form>
    </Form>
  );
}
