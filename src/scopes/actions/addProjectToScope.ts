import { arrayUnion, updateDoc, serverTimestamp } from '@firebase/firestore'
import { collections } from '../../services/firebase'
import { getProjectAbsoluteStorageUrl } from '../../services/staticApisFiles.ts'
import { Project } from '../../types.ts'

export const addProjectToScope = async (
    scopeId: string,
    project: { name: string; id: string; url: string | undefined }
) => {
    const currentScopeRef = collections.scope(scopeId)

    const newProject: Omit<Project, 'createdAt' | 'updatedAt'> = {
        name: project.name,
        id: project.id,
        url: project.url ?? '',
        projectJsonUrl: getProjectAbsoluteStorageUrl(scopeId, project.id),
        sponsorIds: [],
    }

    await updateDoc(currentScopeRef, {
        projects: arrayUnion(newProject),
        updatedAt: serverTimestamp(),
    })
}
