import { baseStorageUrl } from './firebase.ts'

export const getStorageRelativeUrlForImage = (scopeId: string) => {
    return `scopes/${scopeId}/images/`
}

export const getScopeRelativeStorageUrl = (scopeId: string) => {
    return `scopes/${scopeId}/scopes.json`
}
export const getProjectRelativeStorageUrl = (scopeId: string, projectId: string) => {
    return `scopes/${scopeId}/projects/${projectId}.json`
}

export const getScopeAbsoluteStorageUrl = (scopeId: string) => {
    return `${baseStorageUrl}/${getScopeRelativeStorageUrl(scopeId)}`
}
export const getProjectAbsoluteStorageUrl = (scopeId: string, projectId: string) => {
    return `${baseStorageUrl}/${getProjectRelativeStorageUrl(scopeId, projectId)}`
}
