import prisma from '@/lib/prisma';
import { AddTodoForm } from './_components/add-todo-form';
import { TodoItem } from './_components/todo-item';

export default async function Home() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      completed: 'asc',
    },
  });

  return (
    <div className="p-4 flex flex-col gap-2 items-center w-[400px] mx-auto">
      <AddTodoForm todos={todos} />
      <ul className="w-full space-y-2 mt-4">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
