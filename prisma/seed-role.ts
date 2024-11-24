import prisma from "@/lib/prisma";

const data = [
  {
    name: "USER",
    permissions: ["can read post"],
  },
  {
    name: "OWNER",
    permissions: [
      "can read post",
      "can create post",
      "can update post",
      "can delete post",
    ],
  },
  {
    name: "ADMIN",
    permissions: [
      "can read post",
      "can create post",
      "can update post",
      "can delete post",
    ],
  },
];

const seed = async () => {
  try {
    for (const roleData of data) {
      // 创建角色并通过 name 关联权限
        await prisma.role.create({
          data: {
            name: roleData.name,
            permissions: {
              connect: roleData.permissions.map((permName) => ({ name: permName })), // 通过 name 关联
            },
          },
        });
  
      console.log(`✅ Permissions set for role ${roleData.name}.`);
    }

    console.log(" 🚀️ 🚀️ 🚀️ completed successfully.");
  } catch (error) {
    console.error("💥️ 💥️ 💥️ Error :", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();