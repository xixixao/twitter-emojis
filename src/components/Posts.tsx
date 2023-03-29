import Link from "next/link";
import { type RouterOutput } from "~/types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function Posts({ posts }: { posts: RouterOutput["posts"]["getAll"] }) {
  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="m-3 flex">
          <img width={40} alt="pic" src={post.author?.profileImageUrl} />
          <Link href={`/post/${post.id}`}>
            <div className="flex">
              <Link href={`/@${post.author?.username ?? ""}`}>
                {post.author?.username}
              </Link>{" "}
              . {dayjs(post.createdAt).fromNow()}
            </div>
            {post.content}
          </Link>
        </div>
      ))}
    </>
  );
}
