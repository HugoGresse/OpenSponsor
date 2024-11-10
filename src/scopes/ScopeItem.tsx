import { useState } from 'react'
import { Project, Scope, Sponsor } from '../types'
import { Box, Button, Card, CardContent, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material'
import { AddSponsorModal } from './modals/AddSponsorModal'
import { AddProjectModal } from './modals/AddProjectModal'
import { addProjectToScope } from './actions/addProjectToScope.ts'
import { addSponsorToScope } from './actions/addSponsorToScope.ts'
import { SponsorItem } from './SponsorItem.tsx'
import {
    useFirestoreDocumentArrayItemMutation,
    useFirestoreDocumentMutation,
} from '../services/firestoreMutationHooks.ts'
import { collections } from '../services/firebase.ts'
import { arrayRemove } from '@firebase/firestore'
import { ProjectItem } from './ProjectItem.tsx'

export const ScopeItem = ({ scope, reloadScope }: { scope: Scope; reloadScope: () => void }) => {
    const documentMutation = useFirestoreDocumentMutation(collections.scope(scope.id))
    const documentArrayItemMutation = useFirestoreDocumentArrayItemMutation(collections.scope(scope.id))
    const [expanded, setExpanded] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const displayedSponsors = expanded ? scope.sponsors : scope.sponsors.slice(0, 10)
    const displayedProjects = expanded ? scope.projects : scope.projects.slice(0, 10)

    const [openSponsorModal, setOpenSponsorModal] = useState<boolean | Sponsor>(false)
    const [openProjectModal, setOpenProjectModal] = useState<boolean | Project>(false)

    return (
        <Card
            sx={{
                m: 2,
                '&:hover': {
                    boxShadow: 6,
                },
            }}
        >
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {scope.name}

                    {documentMutation.isLoading && <CircularProgress />}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                    <Box flex={1}>
                        <Typography variant="h6">Sponsors ({displayedSponsors.length})</Typography>
                        <Box>
                            {displayedSponsors.map((sponsor) => (
                                <SponsorItem
                                    key={'sponsor-' + sponsor.id}
                                    sponsor={sponsor}
                                    onEdit={() => {
                                        setOpenSponsorModal(sponsor)
                                    }}
                                    onDelete={() => {
                                        documentMutation
                                            .mutate({
                                                sponsors: arrayRemove(sponsor),
                                            })
                                            .then(() => {
                                                reloadScope()
                                            })
                                    }}
                                />
                            ))}
                        </Box>
                        {scope.sponsors.length > 10 && !expanded && (
                            <Button
                                sx={{ mt: 2 }}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setExpanded(true)
                                }}
                            >
                                See more
                            </Button>
                        )}
                        <Button
                            sx={{ mt: 2 }}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpenSponsorModal(true)
                            }}
                        >
                            Add sponsor
                        </Button>
                    </Box>

                    <Box flex={1}>
                        <Typography variant="h6">Projects ({displayedProjects.length})</Typography>
                        <Box>
                            {displayedProjects.map((project) => (
                                <ProjectItem
                                    key={project.id}
                                    project={project}
                                    scope={scope}
                                    onEdit={() => {
                                        setOpenProjectModal(project)
                                    }}
                                    onDelete={() => {
                                        documentMutation
                                            .mutate({
                                                projects: arrayRemove(project),
                                            })
                                            .then(() => {
                                                reloadScope()
                                            })
                                    }}
                                    onSponsorChanges={(sponsorIds) => {
                                        documentArrayItemMutation
                                            .mutate(
                                                {
                                                    ...project,
                                                    sponsorIds,
                                                },
                                                'projects',
                                                project
                                            )
                                            .then(() => {
                                                reloadScope()
                                            })
                                    }}
                                />
                            ))}
                        </Box>
                        {scope.projects.length > 10 && !expanded && (
                            <Button
                                sx={{ mt: 2 }}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setExpanded(true)
                                }}
                            >
                                See more
                            </Button>
                        )}
                        <Button
                            sx={{ mt: 2 }}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpenProjectModal(true)
                            }}
                        >
                            Add project
                        </Button>
                    </Box>
                </Box>
            </CardContent>
            <AddSponsorModal
                key={scope.id + '-add-sponsor-modal' + openSponsorModal.toString()}
                scopeId={scope.id}
                open={!!openSponsorModal}
                sponsor={typeof openSponsorModal === 'object' ? (openSponsorModal as Sponsor) : undefined}
                onClose={() => setOpenSponsorModal(false)}
                onSubmit={async (data, isEdit) => {
                    if (isEdit) {
                        return documentArrayItemMutation.mutate(data, 'sponsors', openSponsorModal).then(() => {
                            reloadScope()
                            setOpenSponsorModal(false)
                        })
                    }
                    await addSponsorToScope(scope.id, data)
                    setOpenSponsorModal(false)
                    reloadScope()
                }}
            />
            <AddProjectModal
                key={scope.id + '-add-project-modal' + openProjectModal.toString()}
                open={!!openProjectModal}
                project={typeof openProjectModal === 'object' ? (openProjectModal as Project) : undefined}
                onClose={() => setOpenProjectModal(false)}
                onSubmit={async (data, isEdit) => {
                    if (isEdit) {
                        return documentArrayItemMutation.mutate(data, 'projects', openProjectModal).then(() => {
                            reloadScope()
                            setOpenProjectModal(false)
                        })
                    }
                    await addProjectToScope(scope.id, data)
                    setOpenProjectModal(false)
                    reloadScope()
                }}
            />
        </Card>
    )
}
