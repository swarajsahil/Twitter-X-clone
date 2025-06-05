"use client";
import Link from "next/link";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProtectedLayout } from "../components/ProtectedLayout";
import { useState } from "react";

type Notification = {
    _id: string;
    type: "follow" | "like";
    from: {
        _id: string;
        username: string;
        profileImg?: string | null;
        fullName?: string | null;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
};
const NotificationPage = () => {

	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const { data: notifications, isLoading } = useQuery<Notification[]>({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("http://localhost:3000/api/notification/all");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Failed to fetch notifications");
				}
				// console.log(data);
				return data.notifications;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	});

	const {mutate:deleteNotifications,isPending}=useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("http://localhost:3000/api/notification/delete", {
					method: "DELETE",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Failed to delete notifications");
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
			// alert("All notifications deleted successfully");
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
	return (
		<ProtectedLayout>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					 {/* Dropdown container with manual control */}
                    <div className="relative">
                        {/* Settings icon button */}
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <IoSettingsOutline className='w-5 h-5' />
                        </button>
                        
                        {/* Dropdown menu - conditionally rendered */}
                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                                <div 
                                    className="py-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => deleteNotifications()}
                                        disabled={isPending}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {isPending ? "Deleting..." : "Delete all notifications"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                
                {/* Click outside to close dropdown */}
                {isOpen && (
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                )}
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification?._id}>
						<div className='flex gap-2 p-4'>
							{notification?.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification?.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link href={`/profile/${notification?.from?.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification?.from?.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification?.from?.username}</span>{" "}
									{notification?.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</ProtectedLayout>
	);
};
export default NotificationPage;