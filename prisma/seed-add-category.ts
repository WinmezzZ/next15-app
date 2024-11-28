import prisma from '@/lib/prisma';

export default async function main() {
  const categories = await prisma.$queryRaw`
    WITH RECURSIVE CategoryTree AS (
      SELECT id, name, "parentId", ARRAY[id] AS path
      FROM "Category"
      WHERE "parentId" IS NULL
      UNION ALL
      SELECT c.id, c.name, c."parentId", ct.path || c.id
      FROM "Category" c
      INNER JOIN CategoryTree ct ON c."parentId" = ct.id
    )
    SELECT jsonb_agg(jsonb_build_object(
      'id', id,
      'name', name,
      'parentId', "parentId",
      'path', path
    ) ORDER BY path) AS tree
    FROM CategoryTree;
  `;

  console.log(categories);

  // for (const category of categories) {
  //   await prisma.category.create({ data: { name: category.name, children: { create: category.children } } });
  // }
}

main();
