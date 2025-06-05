// components/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

const defaultQueryFn = async ({ queryKey }:any) => {
	const res = await fetch(`/api/${queryKey[0]}`);
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.error || "Something went wrong");
	}
	return data;
};

export function Providers({ children }: { children: ReactNode }) {
  // Create client inside the Client Component
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: defaultQueryFn,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000 // 1 minute
      }
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}