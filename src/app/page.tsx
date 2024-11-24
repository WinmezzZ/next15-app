import prisma from "@/lib/prisma";
import { defineAbilitiesForUserId } from "@/lib/casl-prisma";
import { signIn } from "@/auth";

const userId = 'cm3u5vle90000n4wpre5c7vkr'

export default async function Home() {
  const ability = await defineAbilitiesForUserId(userId);

  if (!ability.can("edit", "Post")) {
    console.log("You are not allowed to read posts");
  }

  const posts = await prisma.post.findMany();

  return (
    <div>
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
