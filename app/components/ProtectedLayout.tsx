// components/ProtectedLayout.tsx
'use client'

import { ProtectedRoute } from './ProtectedRoute'
import RightPanel from './RightPanel'
import Sidebar from './Sidebar'

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
        <RightPanel/>
      </div>
    </ProtectedRoute>
  )
}