import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "@/app/components/hooks/useAuthUser";
import { toast } from "react-hot-toast";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const updateProfile = async (formData: FormData | Record<string, any>) => {
    let body;
    
    if (formData instanceof FormData) {
      // Handle file uploads
      body = formData;
    } else {
      // Handle JSON data
      body = JSON.stringify(formData);
    }

    const res = await fetch(`http://localhost:3000/api/user/update`, {
      method: "POST",
      body,
      headers: formData instanceof FormData ? {} : { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update profile");
    }

    return res.json();
  };

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], (old: any) => ({
        ...old,
        user: data,
      }));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    updateProfile: mutation.mutate,
    isUpdatingProfile: mutation.isPending,
  };
};

export default useUpdateUserProfile;