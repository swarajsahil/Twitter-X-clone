"use client";
import Post from "@/app/components/common/Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

type PostProps = {
    feedType: string;
    username?: string;
    userId?: string;
};
export type PostType = {
  _id: string;
  text: string;
  img?: string;
  likes: string[];
  bookmarks: string[];
  comments: {
    text: string;
    user: {
        _id: string;
        fullName: string;
        username: string;
        profileImg?: string | null;
    };
    _id: string;
  }[];
  user: {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    profileImg?: string | null;
    bio?: string | null;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};
const Posts = ({feedType,username ,userId}:PostProps) => {
	// const isLoading = false;
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "http://localhost:3000/api/post/all";
			case "following":
				return "http://localhost:3000/api/post/following";
			case "posts":
				return `http://localhost:3000/api/post/userPost/${username}`;
			case "likes":
				return `http://localhost:3000/api/post/likes/${userId}`;
			default:
				return "http://localhost:3000/api/post/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const { data: posts, isLoading, refetch , isRefetching } = useQuery<PostType[]>({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				// console.log(data);
				
				return data;
			} catch (error:any) {
				throw new Error(error);
			}
		},
		// retry: false,
	});
	useEffect(() => {
		refetch();
	}, [feedType, refetch , username]);
	
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;