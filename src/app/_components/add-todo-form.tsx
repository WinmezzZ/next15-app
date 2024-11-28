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

const initialValues: z.infer<typeof addTodoSchema> = {
  newTodo: '',
};

export function AddTodoForm() {
  const form = useForm<z.infer<typeof addTodoSchema>>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: initialValues,
  });

  const { control, formState } = form;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addTodoAction)} className="flex gap-2">
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
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Add
        </Button>
      </form>
    </Form>
  );
}
