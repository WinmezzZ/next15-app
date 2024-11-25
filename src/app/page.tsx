import prisma from "@/lib/prisma";
import { defineAbilitiesForUserId } from "@/lib/casl-prisma";
import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();
  // const ability = await defineAbilitiesForUserId(session?.user?.id);

  // if (!ability.can("edit", "Post")) {
  //   console.log("You are not allowed to read posts");
  // }

  const posts = await prisma.post.findMany({ where: { authorId: session?.user?.id } });

  return (
    <div >
      <form
          action={async () => {
            "use server"
            await signIn()
          }}
        >
      <button type="submit">Sign in</button>
    </form>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
