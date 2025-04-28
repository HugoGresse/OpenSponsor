import { useFirestoreDocument } from './firestoreQueryHook'
import { collections } from './firebase'
import { doc } from '@firebase/firestore'
import { FirestoreDataConverter, Timestamp } from '@firebase/firestore'
import { useMemo } from 'react'

interface YearData {
    total: number
    [month: string]: number
}

interface AggregateData {
    [year: string]: YearData
}

interface ClickData {
    sponsorId: string
    scopeId: string
    totalClicks: number
    aggregate: AggregateData
    lastUpdated: Timestamp
}

const clickDataConverter: FirestoreDataConverter<ClickData> = {
    fromFirestore(snapshot) {
        const data = snapshot.data()
        return {
            sponsorId: data.sponsorId,
            scopeId: data.scopeId,
            totalClicks: data.totalClicks,
            aggregate: data.aggregate,
            lastUpdated: data.lastUpdated,
        }
    },
    toFirestore(data: ClickData) {
        return data
    },
}

export const useSponsorStats = (scopeId: string, sponsorId: string) => {
    const docRef = useMemo(() => {
        return doc(collections.scope(scopeId), 'clicks', sponsorId).withConverter(clickDataConverter)
    }, [scopeId, sponsorId])
    return useFirestoreDocument<ClickData>(docRef)
}
