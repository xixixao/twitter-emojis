import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import SuperJSON from "superjson";
import { Posts } from "~/components/Posts";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({ username });

  if (!data) {
    return <>Profile not found</>;
  }

  return (
    <>
      <Head>
        <title>Twitter Emojis - Profile</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-300">
        Profile Page
        <div>
          <img width={40} alt="pic" src={data?.profileImageUrl} />
          {data?.username}
          <ProfilePosts userId={data.id} />
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

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("no slug found");
  }

  const username = slug.replace(/^@/, "");

  await ssg.profile.getUserByUsername.prefetch({
    username,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
