"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "@/app/components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "@/app/components/common/EditProfileModal";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "@/app/components/hooks/useAuthUser";
import useUpdateUserProfile from "@/app/components/hooks/useUpdateUserProfile";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "@/app/components/hooks/useFollow";
import { useParams } from "next/navigation";
import { ProtectedLayout } from "@/app/components/ProtectedLayout";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  profileImg?: string;
  coverImg?: string;
  bio?: string;
  link?: string;
  following: string[];
  followers: string[];
  createdAt: string;
}
type PostsResponse = {
  posts: {
    _id: string;
    text: string;
    img?: string;
    likes: string[];
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
  }[];
};

 const ProfilePage =() => {
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"posts" | "likes">("posts");
  const coverImgRef = useRef<HTMLInputElement>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);
  const { authUser } = useAuthUser();
//   const { username } =  await params;
const params = useParams();
  const username = params.username as string;

  const { data: posts } = useQuery<PostsResponse[]>({ queryKey: ["posts"] });
  const { 
    data: user, 
    isLoading, 
    refetch, 
    isRefetching 
  } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/api/user/profile/${username}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return res.json();
    },
  });
//   console.log(user);
  
  const memberSinceDate = user?.createdAt
  ? formatMemberSinceDate(user.createdAt)
  : "";
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
  const { follow, isPending: isFollowing } = useFollow();
  const amIFollowing = authUser?.user?.following?.includes(user?._id || "");
  const isMyProfile = authUser?.user?._id === user?._id;
  // console.log(authUser);
  

  const handleImgChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: "coverImg" | "profileImg"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        type === "coverImg" ? setCoverImg(result) : setProfileImg(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!coverImg && !profileImg) return;

  const formData = new FormData();
  if (coverImg) formData.append('coverImg', coverImg);
  if (profileImg) formData.append('profileImg', profileImg);

  try {
     await updateProfile(formData);
      setProfileImg(null);
      setCoverImg(null);
      refetch();
    } catch (error) {
      console.error("Failed to update profile images:", error);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <ProtectedLayout>
    <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
      {/* HEADER */}
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <p className='text-center text-lg mt-4'>User not found</p>
      )}

      <div className='flex flex-col'>
        {!isLoading && !isRefetching && user && (
          <>
            <div className='flex gap-10 px-4 py-2 items-center'>
              <Link href='/'>
                <FaArrowLeft className='w-4 h-4' />
              </Link>
              <div className='flex flex-col'>
                <p className='font-bold text-lg'>{user.fullName}</p>
                <span className='text-sm text-slate-500'>
                  {posts?.length|| 0} posts
                </span>
              </div>
            </div>

            {/* COVER IMAGE */}
            <div className='relative group/cover'>
              <img
                src={coverImg || user.coverImg || "/cover.png"}
                className='h-52 w-full object-cover'
                alt='cover image'
              />
              {/* {isMyProfile && (
                <div
                  className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                  onClick={() => coverImgRef.current?.click()}
                >
                  <MdEdit className='w-5 h-5 text-white' />
                </div>
              )} */}

              <input
                type='file'
                hidden
                accept='image/*'
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type='file'
                hidden
                accept='image/*'
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />

              {/* PROFILE IMAGE */}
             <div className='avatar absolute -bottom-24 left-4'>
  <div className='w-20 h-20 rounded-full relative group/avatar overflow-hidden'>
    <img 
      src={profileImg || user.profileImg || "/avatar-placeholder.png"} 
      alt={`${user.username}'s profile`}
      className="w-full h-full rounded-full aspect-square object-cover"
    />
    {isMyProfile && (
      <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
        {/* <MdEdit
          className='w-4 h-4 text-white'
          onClick={() => profileImgRef.current?.click()}
        /> */}
      </div>
    )}
  </div>
</div>

            </div>

            {/* ACTION BUTTONS */}
            <div className='flex justify-end px-4 mt-5'>
              {isMyProfile ? (
                <EditProfileModal />
              ) : (
                <button
                  className='btn btn-outline rounded-full btn-sm'
                  onClick={() => user?._id && follow(user?._id)}
                  disabled={isFollowing}
                >
                  {isFollowing ? "Loading..." : amIFollowing ? "Unfollow" : "Follow"}
                </button>
              )}

              {(coverImg || profileImg) && (
                <button
                  className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              )}
            </div>

            {/* USER INFO */}
            <div className='flex flex-col gap-4 mt-14 px-4'>
              <div className='flex flex-col'>
                <span className='font-bold text-lg'>{user.fullName}</span>
                <span className='text-sm text-slate-500'>@{user.username}</span>
                <span className='text-sm my-1'>{user.bio}</span>
              </div>

              <div className='flex gap-2 flex-wrap'>
                {user.link && (
                  <div className='flex gap-1 items-center '>
                    <FaLink className='w-3 h-3 text-slate-500' />
                    <Link 
                      href={user.link} 
                      target='_blank'
                      className='text-blue-500 hover:underline'
                    >
                      {user.link}
                    </Link>
                  </div>
                )}
                <div className='flex gap-2 items-center'>
                  <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                  <span className='text-sm text-slate-500'>{memberSinceDate}</span>
                </div>
              </div>

              <div className='flex gap-2'>
                <div className='flex gap-1 items-center'>
                  <span className='font-bold text-xs'>{user.following.length}</span>
                  <span className='text-slate-500 text-xs'>Following</span>
                </div>
                <div className='flex gap-1 items-center'>
                  <span className='font-bold text-xs'>{user.followers.length}</span>
                  <span className='text-slate-500 text-xs'>Followers</span>
                </div>
              </div>
            </div>

            {/* FEED TOGGLE */}
            <div className='flex w-full border-b border-gray-700 mt-4'>
              {(["posts", "likes"] as const).map((type) => (
                <div
                  key={type}
                  className={`flex justify-center flex-1 p-3 ${
                    feedType === type ? "" : "text-slate-500"
                  } hover:bg-secondary transition duration-300 relative cursor-pointer`}
                  onClick={() => setFeedType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {feedType === type && (
                    <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <Posts feedType={feedType} username={username} userId={user?._id} />
      </div>
    </div>
    </ProtectedLayout>
  );
};

export default ProfilePage;