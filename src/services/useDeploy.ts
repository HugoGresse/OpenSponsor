import { useCallback, useEffect, useState } from 'react'
import { Scope } from '../types.ts'
import {
    getProjectAbsoluteStorageUrl,
    getProjectRelativeStorageUrl,
    getScopeAbsoluteStorageUrl,
    getScopeRelativeStorageUrl,
} from './staticApisFiles.ts'
import { Timestamp, doc, updateDoc } from '@firebase/firestore'
import { ref, uploadString } from 'firebase/storage'
import { collections, storage } from './firebase.ts'
import { fetchJsonGeneratedAt } from './fetchJsonGeneratedAt.ts'

const deployFunction = async (scope: Scope) => {
    const metadata = {
        contentType: 'application/json',
    }

    if (!scope.scopeJsonUrl || scope.scopeJsonUrl.length === 0) {
        const ref = collections.scope(scope.id)
        await updateDoc(ref, {
            scopeJsonUrl: getScopeAbsoluteStorageUrl(scope.id),
        })
    }
    for (const project of scope.projects) {
        if (!project.projectJsonUrl || project.projectJsonUrl.length === 0) {
            const ref = doc(collections.scope(scope.id), project.id)
            await updateDoc(ref, {
                projectJsonUrl: getProjectAbsoluteStorageUrl(scope.id, project.id),
            })
        }
    }

    const outputRefPublic = ref(storage, getScopeRelativeStorageUrl(scope.id))

    const scopeJson = {
        generatedAt: new Date().toISOString(),
        updatedAt: (scope.updatedAt as Timestamp).toDate().toISOString(),
        sponsors: scope.sponsors.map((sponsor) => ({
            id: sponsor.id,
            name: sponsor.name,
            website: sponsor.website,
            logo: sponsor.logo,
        })),
        projects: scope.projects.map((project) => ({
            id: project.id,
            name: project.name,
            url: project.url,
            sponsorIds: project.sponsorIds,
            sponsors: project.sponsorIds.map((sponsorId) => scope.sponsors.find((s) => s.id === sponsorId)),
        })),
    }

    // Promise array
    return [
        uploadString(outputRefPublic, JSON.stringify(scopeJson), undefined, metadata),
        ...scope.projects.map((project) => {
            const outputRef = ref(storage, getProjectRelativeStorageUrl(scope.id, project.id))
            return uploadString(
                outputRef,
                JSON.stringify({
                    generatedAt: new Date().toISOString(),
                    sponsors: project.sponsorIds.map((sponsorId) => scope.sponsors.find((s) => s.id === sponsorId)),
                    url: project.url,
                    name: project.name,
                }),
                undefined,
                metadata
            )
        }),
    ]
}

export const useDeploy = (scope: Scope, modalOpen: boolean) => {
    const [isDeploying, setIsDeploying] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const [jsonLastFetchResult, setJsonLastFetchResult] = useState<string>('Loading...')

    const reloadGeneratedAtDate = useCallback(() => {
        fetchJsonGeneratedAt(scope.scopeJsonUrl + '?t=' + Date.now()).then(setJsonLastFetchResult)
    }, [scope.scopeJsonUrl])

    useEffect(() => {
        if (modalOpen) {
            reloadGeneratedAtDate()
        }
    }, [modalOpen, reloadGeneratedAtDate])

    const deploy = useCallback(async () => {
        setIsDeploying(true)

        try {
            const promiseArray = await deployFunction(scope)

            await Promise.all(promiseArray)
        } catch (error) {
            console.error(error)
            setError(error as Error)
        }

        reloadGeneratedAtDate()

        setIsDeploying(false)
    }, [scope, reloadGeneratedAtDate])

    return {
        deploy,
        isDeploying,
        error,
        lastDeployedAt: jsonLastFetchResult,
    }
}
