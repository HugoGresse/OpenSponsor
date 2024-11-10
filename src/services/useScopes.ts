import { useFirestoreCollection, UseQueryResult } from './firestoreQueryHook'
import { collections } from './firebase.ts'
import { Scope } from '../types.ts'
import { query, QueryConstraint, where } from '@firebase/firestore'

export const useScopes = (userId: string | null): UseQueryResult<Scope[]> => {
    const constraints: QueryConstraint[] = []

    constraints.push(where('members', 'array-contains', userId))

    return useFirestoreCollection(query(collections.scopes(), ...constraints))
}
