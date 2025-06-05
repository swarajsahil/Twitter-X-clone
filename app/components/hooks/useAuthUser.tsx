"use client";
import {  useQuery, useQueryClient } from "@tanstack/react-query";

const useAuthUser = () => {
	const queryClient = useQueryClient();

	const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("http://localhost:3000/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				// console.log("authUser is here:", data);
				return data;
			} catch (error:any) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	return { authUser, isLoading };
};

export default useAuthUser;