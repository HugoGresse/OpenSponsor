import { arrayUnion, updateDoc, serverTimestamp } from '@firebase/firestore'
import { collections } from '../../services/firebase'
import { slugify } from '../../utils/slugify'

export const addSponsorToScope = async (scopeId: string, sponsor: { name: string; website: string; logo: string }) => {
    const currentScopeRef = collections.scope(scopeId)
    await updateDoc(currentScopeRef, {
        sponsors: arrayUnion({
            name: sponsor.name.trim(),
            id: slugify(sponsor.name),
            website: sponsor.website,
            logo: sponsor.logo || '',
        }),
        updatedAt: serverTimestamp(),
    })
}
