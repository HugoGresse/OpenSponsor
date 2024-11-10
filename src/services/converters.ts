import { Scope, Sponsor } from '../types'
import { FirestoreDataConverter } from '@firebase/firestore'

export const sponsorConverter: FirestoreDataConverter<Sponsor> = {
    fromFirestore(snapshot): Sponsor {
        const data = snapshot.data()

        return {
            id: snapshot.id,
            ...data,
        } as Sponsor
    },
    toFirestore(session: Sponsor) {
        return Object.keys(session).reduce((acc, key) => {
            // @ts-expect-error manage undefined as null
            acc[key] = session[key] === undefined ? null : session[key]
            return acc
        }, {})
    },
}

export const scopeConverter: FirestoreDataConverter<Scope> = {
    fromFirestore(snapshot): Scope {
        const data = snapshot.data()

        return {
            id: snapshot.id,
            ...data,
        } as Scope
    },
    toFirestore(project: Scope) {
        return Object.keys(project).reduce((acc, key) => {
            // @ts-expect-error manage undefined as null
            acc[key] = project[key] === undefined ? null : project[key]
            return acc
        }, {})
    },
}
