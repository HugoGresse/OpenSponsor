import { useFirestoreCollection, UseQueryResult } from './firestoreQueryHook'
import { collections } from './firebase.ts'
import { Scope } from '../types.ts'
import { query, QueryConstraint, where } from '@firebase/firestore'
import { useMemo } from 'react'

export const useScopes = (userId: string | null): UseQueryResult<Scope[]> => {
    const queryToRun = useMemo(() => {
        const constraints: QueryConstraint[] = []

        constraints.push(where('members', 'array-contains', userId))
        return query(collections.scopes(), ...constraints)
    }, [userId])

    return useFirestoreCollection(queryToRun)
}
