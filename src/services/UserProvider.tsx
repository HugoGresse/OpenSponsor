import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

type UserContextType = {
    userId: string | null
    logout: () => Promise<void>
}

export const UserContext = createContext<UserContextType>({
    userId: null,
    logout: () => Promise.resolve(),
} as UserContextType)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userId, setUserId] = useState<string | null>(null)
    const auth = useMemo(() => getAuth(), [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user?.uid || null)
        })
        return () => unsubscribe()
    }, [auth])

    const logout = useCallback(() => signOut(auth), [auth])

    return <UserContext.Provider value={{ userId, logout }}>{children}</UserContext.Provider>
}
