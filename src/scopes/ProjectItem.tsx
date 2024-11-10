import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Project, Scope } from '../types'
import { useState } from 'react'
import { SelectSponsorModal } from './modals/SelectSponsorModal.tsx'

interface ProjectItemProps {
    project: Project
    scope: Scope
    onEdit: () => void
    onDelete: () => void
    onSponsorChanges: (sponsorIds: string[]) => void
}

export const ProjectItem = ({ project, scope, onEdit, onDelete, onSponsorChanges }: ProjectItemProps) => {
    const [selectSponsorModalOpen, setAddSponsorModalOpen] = useState(false)

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                gap: 2,
                maxWidth: '500px',
            }}
        >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', alignSelf: 'stretch' }}>
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {project.name}
                </Typography>

                <Button onClick={() => setAddSponsorModalOpen(true)}>
                    Select sponsors ({project.sponsorIds.length})
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={onEdit} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={onDelete} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>

            {project.sponsorIds.map((sponsorId) => {
                return (
                    <Typography key={sponsorId} variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {scope.sponsors.find((sponsor) => sponsor.id === sponsorId)?.name}
                    </Typography>
                )
            })}

            {selectSponsorModalOpen && (
                <SelectSponsorModal
                    open={selectSponsorModalOpen}
                    sponsorIds={project.sponsorIds}
                    sponsors={scope.sponsors}
                    onClose={() => setAddSponsorModalOpen(false)}
                    onSelect={(sponsorIds) => {
                        setAddSponsorModalOpen(false)
                        onSponsorChanges(sponsorIds)
                    }}
                />
            )}
        </Paper>
    )
}
