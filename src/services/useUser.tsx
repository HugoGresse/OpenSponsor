import { useContext } from 'react'
import { UserContext } from './UserProvider.tsx'

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error('useUser must be used within UserProvider')
    return context
}
