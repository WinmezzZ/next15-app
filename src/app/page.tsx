import prisma from '@/lib/prisma';
import { AddTodoForm } from './_components/add-todo-form';
import { TodoItem } from './_components/todo-item';

export default async function Home() {
  const todos = await prisma.todo.findMany();

  return (
    <div>
      <AddTodoForm todos={todos} />
      <ul>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
