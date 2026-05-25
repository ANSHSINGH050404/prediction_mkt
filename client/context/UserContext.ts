import { createContext } from 'react'
import type { User } from '@/store/authStore'

export interface UserContextType {
  user: User | null
  setUser: (user: User) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
})

export default UserContext
