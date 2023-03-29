import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });
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

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });
      return post;
    }),
});
