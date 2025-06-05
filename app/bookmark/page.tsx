'use client';

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import useAuthUser from "../components/hooks/useAuthUser";
import { ProtectedLayout } from "../components/ProtectedLayout";
import { PostType } from "../components/common/Posts";
import Link from "next/link";
import { formatPostDate } from "../utils/date";
import PostSkeleton from "../components/skeletons/PostSkeleton";
import Post from "../components/common/Post";

export default function BookmarkPage() {
  const { authUser, isLoading: authLoading } = useAuthUser();

  const userId = authUser?.user?._id;

  const { data: posts = [], isLoading } = useQuery<PostType[]>({
    queryKey: ["posts"],
    enabled: !!userId, // run only when user is ready
  });

  if (authLoading || isLoading) {
    return <p className="text-center p-4">Loading bookmarks...</p>;
  }
  const bookmarkedPosts = posts.filter((post: any) =>
    post.bookmarks.includes(userId)
  );
//   console.log("Bookmarked Posts:", bookmarkedPosts);
  

  return (
    <ProtectedLayout>
        <>
			{(isLoading) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{bookmarkedPosts.map((post) => (
                        // <Link href={`/post/${post._id}`} className="block" key={post._id}>
						<Post key={post._id} post={post} />
                        // </Link>
					))}
				</div>
			)}
		</>
    </ProtectedLayout>
  );
}