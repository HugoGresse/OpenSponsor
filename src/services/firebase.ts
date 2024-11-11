import { initializeApp } from 'firebase/app'
import { collection, doc, Firestore, getFirestore } from '@firebase/firestore'
import { FirebaseApp } from '@firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { Auth } from '@firebase/auth'
import { scopeConverter } from './converters'

const config = {
    apiKey: import.meta.env.VITE_FIREBASE_OPEN_SPONSOR_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_OPEN_SPONSOR_DOMAIN,
    databaseURL: `https://${import.meta.env.VITE_FIREBASE_OPEN_SPONSOR_PROJECT_ID}.firebaseio.com`,
    projectId: import.meta.env.VITE_FIREBASE_OPEN_SPONSOR_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_OPEN_SPONSOR_STORAGE_BUCKET,
    appId: import.meta.env.VITE_FIREBASE_OPEN_SPONSOR_APP_ID,
}

export const storageBucket = config.storageBucket
export const baseStorageUrl = `https://storage.googleapis.com/${storageBucket}`

const instanceApp: FirebaseApp = initializeApp(config)
export const instanceFirestore: Firestore = getFirestore(instanceApp)
export const storage = getStorage()

export const collections = {
    scopes: () => collection(instanceFirestore, 'scopes').withConverter(scopeConverter),
    scope: (scopeId: string) => doc(instanceFirestore, 'scopes', scopeId),
}

export const getOpenSponsorAuth = (): Auth => {
    return getAuth(instanceApp)
}
