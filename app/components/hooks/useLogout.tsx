// hooks/useLogout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to logout");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
    console.error("Logout failed:", error);
    // Optionally show a toast notification
  }
  });
}