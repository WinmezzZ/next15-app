import prisma from '@/lib/prisma';
import { TodoList } from './_components/todo-list';

export default async function Home() {
  const todos = await prisma.user.findMany();

  return (
    <div className="p-4 flex flex-col gap-2 items-center w-[400px] mx-auto">
      <TodoList todos={todos} />
    </div>
  );
}
