import {
    addDoc,
    CollectionReference,
    deleteDoc,
    doc,
    DocumentReference,
    setDoc,
    updateDoc,
    arrayRemove,
    arrayUnion,
} from 'firebase/firestore'
import { useCallback, useState } from 'react'

export type UseMutationResult = {
    isLoading: boolean
    error: { message: string } | null | unknown
    isError: boolean
    mutate: (data: never, id?: string) => Promise<string | undefined>
}

export const useFirestoreCollectionMutation = (ref: CollectionReference): UseMutationResult => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)

    const mutate = useCallback(
        async (data: never, id?: string) => {
            try {
                setLoading(true)
                if (id) {
                    await setDoc(doc(ref, id), data, { merge: true })
                    setLoading(false)
                    return id
                }
                const newRef = await addDoc(ref, data)
                setLoading(false)
                return newRef.id
            } catch (error: unknown) {
                setError(error)
            }
            setLoading(false)
        },
        [ref]
    )

    return {
        isLoading,
        error,
        isError: error !== null,
        mutate,
    }
}
export const useFirestoreDocumentMutation = (ref: DocumentReference): UseMutationResult => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)

    const mutate = useCallback(
        async (data: never) => {
            try {
                setLoading(true)
                await setDoc(ref, data, { merge: true }) // We use setDoc to actually trigger the converter
                return undefined
            } catch (error: unknown) {
                setError(error)
            }
            setLoading(false)
        },
        [ref]
    )

    return {
        isLoading,
        error,
        isError: error !== null,
        mutate,
    }
}

export type UseMutationDocumentArrayItemResult = {
    isLoading: boolean
    error: { message: string } | null | unknown
    isError: boolean
    mutate: (data: never, field: string, oldElement: never) => Promise<void>
}
/**
 * This hook is used to mutate an item in an array in a document
 * @param ref
 */
export const useFirestoreDocumentArrayItemMutation = (ref: DocumentReference): UseMutationDocumentArrayItemResult => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)

    const mutate = useCallback(
        async (data: never, field: string, oldElement: never) => {
            try {
                setLoading(true)

                await updateDoc(ref, {
                    [field]: arrayRemove(oldElement),
                })

                await updateDoc(ref, {
                    [field]: arrayUnion(data),
                })
            } catch (error: unknown) {
                setError(error)
            }
            setLoading(false)
        },
        [ref]
    )

    return {
        isLoading,
        error,
        isError: error !== null,
        mutate,
    }
}

export type UseDeletionMutationResult = {
    isLoading: boolean
    error: { message: string } | null | unknown
    isError: boolean
    mutate: (id?: string) => Promise<void>
}
export const useFirestoreDocumentDeletion = (
    ref: DocumentReference | CollectionReference
): UseDeletionMutationResult => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)

    const mutate = useCallback(
        async (id?: string) => {
            try {
                setLoading(true)
                if (ref instanceof CollectionReference) {
                    if (id) {
                        await deleteDoc(doc(ref, id))
                    }
                } else {
                    await deleteDoc(ref)
                }
            } catch (error: unknown) {
                setError(error)
            }
            setLoading(false)
        },
        [ref]
    )

    return {
        isLoading,
        error,
        isError: error !== null,
        mutate,
    }
}
