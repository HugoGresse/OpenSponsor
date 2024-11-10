import { Button, Container, Typography } from '@mui/material'
import { useScopes } from '../services/useScopes.ts'
import { useUser } from '../services/useUser.tsx'
import { useState } from 'react'
import { NewScopeModal } from '../scopes/modals/NewScopeModal.tsx'
import { useFirestoreCollectionMutation } from '../services/firestoreMutationHooks.ts'
import { collections } from '../services/firebase.ts'
import { Scopes } from '../scopes/Scopes.tsx'
import { serverTimestamp } from '@firebase/firestore'

export const Dashboard = () => {
    const { userId, logout } = useUser()
    const scopesResults = useScopes(userId)
    const [newScopeModalOpen, setNewScopeModalOpen] = useState(false)

    const mutation = useFirestoreCollectionMutation(collections.scopes())

    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ justifyContent: 'space-between', display: 'flex' }}>
                Scopes
                <Button variant="contained" onClick={() => logout()} size="small">
                    Logout
                </Button>
            </Typography>

            <Button variant="contained" size="small" onClick={() => setNewScopeModalOpen(true)}>
                Add a scope
            </Button>

            <Scopes scopes={scopesResults.data ?? []} reloadScopes={() => scopesResults.load()} />

            <NewScopeModal
                open={newScopeModalOpen}
                onClose={() => setNewScopeModalOpen(false)}
                onSubmit={(scope) => {
                    mutation
                        .mutate({
                            name: scope,
                            owner: userId,
                            members: [userId],
                            sponsors: [],
                            projects: [],
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        })
                        .then(() => {
                            setNewScopeModalOpen(false)
                            scopesResults.load()
                        })
                }}
            />
        </Container>
    )
}
