'use client'

import { type ReactNode, useCallback } from 'react'
import UserContext from './UserContext'
import { useAuthStore, type User } from '@/store/authStore'

export default function UserContextProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)

  const setUser = useCallback(
    (user: User) => {
      const token = useAuthStore.getState().token
      if (token) setAuth(user, token)
    },
    [setAuth]
  )

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
