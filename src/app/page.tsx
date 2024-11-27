import prisma from '@/lib/prisma';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  const categories = await prisma.category.findMany();

  console.log(
    await prisma.$queryRaw`
      WITH RECURSIVE CategoryTree AS (
        -- Base case: get root categories
        SELECT id, name, "parentId", 1 as level
        FROM "Category"
        WHERE "parentId" IS NULL

        UNION ALL

        -- Recursive case: join with child categories
        SELECT c.id, c.name, c."parentId", ct.level + 1
        FROM "Category" c
        INNER JOIN CategoryTree ct ON c."parentId" = ct.id
      )
      SELECT *
      FROM CategoryTree
      ORDER BY level, name
    `,
  );

  const addCategory = async (formData: FormData) => {
    'use server';
    const parentId = formData.get('parentId') as string;
    await prisma.category.create({
      data: {
        name: formData.get('name') as string,
        parent: parentId
          ? {
              connect: {
                id: parentId,
              },
            }
          : undefined,
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
              <Input name="name" />
              <input type="hidden" name="parentId" value={category.id} />
              <Button type="submit" size="icon">
                <PlusIcon />
              </Button>
            </form>
            <form action={deleteCategory} className="flex">
              <input type="hidden" name="parentId" value={category.id} />
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
