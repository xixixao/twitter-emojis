import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100 });
    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
      })
    ).map(({ id, username, profileImageUrl }) => ({
      id,
      username,
      profileImageUrl,
    }));
    return posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.authorId),
    }));
  }),
});
