'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addTodoSchema } from '../_actions/schema';
import { addTodoAction } from '../_actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const initialValues: z.infer<typeof addTodoSchema> = {
  newTodo: '',
};

export function AddTodoForm() {
  const form = useForm<z.infer<typeof addTodoSchema>>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addTodoAction)} className="space-y-8">
        <FormField
          control={form.control}
          name="newTodo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.newTodo?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
}
