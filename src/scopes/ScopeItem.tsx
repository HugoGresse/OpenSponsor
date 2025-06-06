import { useState } from 'react'
import { Project, Scope, Sponsor } from '../types'
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { AddSponsorModal } from './modals/AddSponsorModal'
import { AddProjectModal } from './modals/AddProjectModal'
import { addProjectToScope } from './actions/addProjectToScope.ts'
import { addSponsorToScope } from './actions/addSponsorToScope.ts'
import { SponsorItem } from './SponsorItem.tsx'
import {
    useFirestoreDocumentArrayItemMutation,
    useFirestoreDocumentDeletion,
    useFirestoreDocumentMutation,
} from '../services/firestoreMutationHooks.ts'
import { collections } from '../services/firebase.ts'
import { arrayRemove } from '@firebase/firestore'
import { ProjectItem } from './ProjectItem.tsx'
import DeleteIcon from '@mui/icons-material/Delete'
import { JsonInfosModals } from '../dashboard/JsonInfosModals.tsx'

export const ScopeItem = ({ scope, reloadScope }: { scope: Scope; reloadScope: () => void }) => {
    const documentMutation = useFirestoreDocumentMutation(collections.scope(scope.id))
    const documentArrayItemMutation = useFirestoreDocumentArrayItemMutation(collections.scope(scope.id))
    const documentDeleteMutation = useFirestoreDocumentDeletion(collections.scope(scope.id))
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
                mt: 2,
                mb: 2,
            }}>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'space-between' }}>
                    <Typography variant="h5" gutterBottom>
                        {scope.name}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        {documentMutation.isLoading && <CircularProgress />}
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm('Are you sure you want to delete this scope?')) {
                                    documentDeleteMutation.mutate().then(() => {
                                        reloadScope()
                                    })
                                }
                            }}>
                            <DeleteIcon color="error" />
                        </IconButton>
                        <JsonInfosModals scope={scope} reloadScope={reloadScope} />
                    </Stack>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                    <Box flex={1}>
                        <Typography variant="h6">Sponsors ({displayedSponsors.length})</Typography>
                        <Box>
                            {displayedSponsors.map((sponsor) => (
                                <SponsorItem
                                    key={sponsor.id}
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
                                                // Also remove this sponsor from any projects that reference it
                                                const updatedProjects = scope.projects.map((project) => {
                                                    if (project.sponsorIds?.includes(sponsor.id)) {
                                                        return {
                                                            ...project,
                                                            sponsorIds: project.sponsorIds.filter(
                                                                (id) => id !== sponsor.id
                                                            ),
                                                        }
                                                    }
                                                    return project
                                                })

                                                // Update any projects that had this sponsor
                                                const projectsWithSponsor = updatedProjects.filter(
                                                    (p, i) => p.sponsorIds !== scope.projects[i].sponsorIds
                                                )

                                                if (projectsWithSponsor.length > 0) {
                                                    // Replace all projects at once to avoid multiple updates
                                                    documentMutation.mutate({
                                                        projects: updatedProjects,
                                                    })
                                                }

                                                reloadScope()
                                            })
                                    }}
                                    scopeId={scope.id}
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
                                }}>
                                See more
                            </Button>
                        )}
                        <Button
                            sx={{ mt: 2 }}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpenSponsorModal(true)
                            }}>
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
                                }}>
                                See more
                            </Button>
                        )}
                        <Button
                            sx={{ mt: 2 }}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpenProjectModal(true)
                            }}>
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
                    if (isEdit && typeof openSponsorModal === 'object') {
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
                    if (isEdit && typeof openProjectModal === 'object') {
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
