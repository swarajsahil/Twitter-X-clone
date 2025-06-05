// components/ProtectedRoute.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './common/LoadingSpinner'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  
  // Fetch user/auth status
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/auth/me')
      if (!res.ok) throw new Error('Not authenticated')
      return res.json()
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    if (isError || (!isLoading && !user)) {
      router.push('/login')
    }
  }, [user])

  if (isLoading || isError || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
}