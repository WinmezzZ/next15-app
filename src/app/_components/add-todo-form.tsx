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

const initialValues: z.infer<typeof addTodoSchema> = {
  newTodo: '',
};

export function AddTodoForm() {
  const form = useForm<z.infer<typeof addTodoSchema>>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: initialValues,
  });

  const { control, formState, handleSubmit } = form;

  const onSubmit = async (values: z.infer<typeof addTodoSchema>) => {
    const result = await addTodoAction(values);
    console.log(result);
    if (result.error) {
      toast({ variant: 'destructive', title: result.error });
    }
  };

  return (
    <Form {...form}>
      <form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
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
