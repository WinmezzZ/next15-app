import prisma from '@/lib/prisma';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  const categories = await prisma.category.findMany();

  const addCategory = async (formData: FormData) => {
    'use server';
    await prisma.category.create({
      data: {
        name: formData.get('name') as string,
        parentId: (formData.get('parentId') as string) || null,
      },
    });
    revalidatePath('/');
  };

  const deleteCategory = async (formData: FormData) => {
    'use server';
    await prisma.category.delete({ where: { id: formData.get('id') as string } });
    revalidatePath('/');
  };

  return (
    <div>
      <form action={addCategory}>
        <Input name="name" required />
        <Button type="submit">Add Category</Button>
      </form>
      <ul>
        {categories.map(category => (
          <li key={category.id} className="flex items-center gap-2">
            {category.name}
            <form action={addCategory} className="flex">
              <Button type="submit" size="icon">
                <PlusIcon />
              </Button>
            </form>
            <form action={deleteCategory} className="flex">
              <input type="hidden" name="id" value={category.id} />
              <Button type="submit" size="icon" variant="destructive">
                <TrashIcon />
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
