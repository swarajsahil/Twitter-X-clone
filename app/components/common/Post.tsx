"use client";
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark , FaBookmark} from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "@/app/utils/date"
import useAuthUser from "../hooks/useAuthUser";
import { toast } from "react-hot-toast";
import { PostType } from "./Posts";

const Post = ({ post } : { post: PostType }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/post/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to Delete Post");
        }
        if (data.error) {
          throw new Error(data.error);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const postOwner = post?.user;
  const isLiked = post?.likes.includes(authUser?.user?._id);
  const isMyPost = authUser?.user?._id === post?.user?._id;
  const formattedDate = formatPostDate(post?.createdAt);
  const [bookmarked, setBookmarked] = useState(post?.bookmarks?.includes(authUser?.user?._id));

  const handleDeletePost = () => {
    deletePost();
  };

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/post/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to Like Post");
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData<PostType[]>(["posts"], (oldData) => {
        return oldData?.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/post/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: comment,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to add Comment");
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Comment added successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: bookmarkPost, isPending: isBookmark } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/post/${post._id}/bookmark`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to bookmark Post");
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Post bookmark successfully");
      setBookmarked((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
    toast.error(error.message || "Something went wrong");
  },
  });

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };


  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar">
  <Link href={`/profile/${postOwner?.username}`} className="w-6 h-6 rounded-full overflow-hidden inline-block">
    <img
      src={postOwner?.profileImg || "/avatar-placeholder.png"}
      className="w-full h-full object-cover rounded-full"
      alt="Profile avatar"
    />
  </Link>
</div>

      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link href={`/profile/${postOwner?.username}`} className="font-bold">
            {postOwner?.fullName}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link href={`/profile/${postOwner?.username}`}>@{postOwner?.username}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              {!isDeleting && <FaTrash className="cursor-pointer hover:text-red-500" onClick={handleDeletePost} />}
              {isDeleting && <LoadingSpinner />}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <Link href={`/comment/${post._id}`}>
            <span>{post.text}</span>
          </Link>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt=""
            />
          )}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={toggleComments}
            >
              <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            <div className="flex gap-1 items-center group cursor-pointer">
              <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
              <span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
            </div>
            <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
              {isLiking && <LoadingSpinner size="sm" />}
              {!isLiked && !isLiking && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
              )}
              {isLiked && !isLiking && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
              )}
              <span
                className={`text-sm group-hover:text-pink-500 ${
                  isLiked ? "text-pink-500" : "text-slate-500"
                }`}
              >
                {post.likes.length}
              </span>
            </div>
          </div>
          <div className="flex w-1/3 justify-end gap-2 items-center">
            <button onClick={() => bookmarkPost()} disabled={isBookmark}>
              {bookmarked ? (
                <FaBookmark className="w-4 h-4 text-blue-500 cursor-pointer" />
              ) : (
                <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {/* Twitter-like Comments Section */}
        {showComments && (
          <div ref={commentsRef} className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex flex-col gap-3">
              {post.comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment?._id} className="flex gap-2 items-start">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={comment.user?.profileImg || "/avatar-placeholder.png"}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm">{comment.user?.fullName}</span>
                        <span className="text-gray-500 text-xs">
                          @{comment.user?.username}
                        </span>
                      </div>
                      <div className="text-sm mt-1">{comment.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form className="mt-3 flex gap-2" onSubmit={handlePostComment}>
              <div className="avatar flex-shrink-0">
                <div className="w-8 rounded-full">
                  <img src={authUser?.user?.profileImg || "/avatar-placeholder.png"} />
                </div>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  className="input input-bordered w-full py-2 px-3 rounded-full bg-transparent border-gray-600 focus:outline-none focus:border-sky-500 text-sm"
                  placeholder="Tweet your reply"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="btn btn-primary btn-sm rounded-full px-4 disabled:opacity-50"
                  disabled={!comment.trim() || isCommenting}
                >
                  {isCommenting ? <LoadingSpinner size="sm" /> : "Reply"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;