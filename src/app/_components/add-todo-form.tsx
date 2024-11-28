'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addTodoSchema } from '../_actions/schema';
import { addTodoAction } from '../_actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';

const initialValues: z.infer<typeof addTodoSchema> = {
  newTodo: '',
};

const initialState = {
  errors: {
    firstName: undefined,
    lastName: undefined,
  },
  message: undefined,
};

export function AddTodoForm() {
  const form = useForm<z.infer<typeof addTodoSchema>>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: initialValues,
  });

  const [state, formAction] = useFormState(addTodoAction, initialState);

  useEffect(() => {
    console.log(state?.errors);
    if (Array.isArray(state?.errors)) {
      // Check if state.errors is an array before iterating
      state.errors.forEach(error => {
        form.setError(error.field, { message: error.message });
      });
    }
  }, [state?.errors]);

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
