import { baseStorageUrl } from './firebase.ts'

export const getStorageRelativeUrlForImage = (scopeId: string) => {
    return `scopes/${scopeId}/images/`
}

export const getScopeStorageUrl = (scopeId: string) => {
    return `${baseStorageUrl}/scopes/${scopeId}.json`
}
export const getProjectStorageUrl = (scopeId: string, projectId: string) => {
    return `${baseStorageUrl}/scopes/${scopeId}/projects/${projectId}.json`
}
