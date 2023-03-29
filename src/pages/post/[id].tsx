import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";

const PostPage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "xixixa",
  });

  return (
    <>
      <Head>
        <title>Twitter Emojis - Post</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-300">
        Profile Page
        <div>
          <img width={40} alt="pic" src={data?.profileImageUrl} />
          {data?.username}
        </div>
      </main>
    </>
  );
};

export default PostPage;
