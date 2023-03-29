import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import SuperJSON from "superjson";
import { Posts } from "~/components/Posts";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const PostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { data } = api.posts.getForId.useQuery({ id: postId });

  if (!data) {
    return <>Post not found</>;
  }

  return (
    <>
      <Head>
        <title>Twitter Emojis - Post</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-300">
        Post page
        <div>
          <img width={40} alt="pic" src={data?.author?.profileImageUrl} />
          {data?.content}
        </div>
      </main>
    </>
  );
};

function ProfilePosts({ userId }: { userId: string }) {
  const { data } = api.posts.getForUser.useQuery({ userId });
  if (!data) {
    return null;
  }
  return <Posts posts={data} />;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON, // optional - adds superjson serialization
  });

  const postId = context.params?.id;

  if (typeof postId !== "string") {
    throw new Error("no slug found");
  }

  await ssg.posts.getForId.prefetch({
    id: postId,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostPage;
