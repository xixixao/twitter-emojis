import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Posts } from "~/components/Posts";

const Home: NextPage = () => {
  const { data } = api.posts.getAll.useQuery();

  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>Twitter Emojis</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-300">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && (
          <>
            <SignOutButton />
            <Composer />
          </>
        )}
        {data && <Posts posts={data} />}
      </main>
    </>
  );
};

function Composer() {
  const { user } = useUser();
  const [content, setContent] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (error) => {
      const message = error.data?.zodError?.fieldErrors.content;
      toast.error("Failed to post! " + (message?.[0] ?? ""));
    },
  });

  return (
    <div className="flex">
      <img width={40} alt="pic" src={user?.profileImageUrl} />
      <input value={content} onChange={(e) => setContent(e.target.value)} />
      {!isPosting ? (
        <button
          onClick={() => {
            mutate({ content });
          }}
        >
          Post
        </button>
      ) : null}
      {isPosting ? <div>Posting...</div> : null}
    </div>
  );
}

export default Home;
