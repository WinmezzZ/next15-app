import prisma from "@/lib/prisma";

const seed = async () => {
  try {
    await prisma.permission.createMany({    
      data: [
        {
          name: "can create post",
          type: JSON.stringify({ action: "create", subject: "Post" }),
        },
        {
          name: "can read post",
          type: JSON.stringify({ action: "read", subject: "Post" }),
        },
        {
          name: "can update post",
          type: JSON.stringify({ action: "update", subject: "Post" }),
        },
        {
          name: "can delete post",
          type: JSON.stringify({ action: "delete", subject: "Post" }),
        },
      ],
    });

    console.log(" 🚀️ 🚀️ 🚀️ completed successfully.");
  } catch (error) {
    console.error("💥️ 💥️ 💥️ Error :", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();