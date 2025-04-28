import { Box, IconButton, Paper, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import BarChartIcon from '@mui/icons-material/BarChart'
import { Sponsor } from '../types'
import { useState } from 'react'
import { SponsorStatsModal } from './modals/SponsorStatsModal'

interface SponsorItemProps {
    sponsor: Sponsor
    onEdit: () => void
    onDelete: () => void
    scopeId: string
}

export const SponsorItem = ({ sponsor, onEdit, onDelete, scopeId }: SponsorItemProps) => {
    const [statsModalOpen, setStatsModalOpen] = useState(false)

    return (
        <>
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    maxWidth: '400px',
                }}>
                <Box
                    component="img"
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'contain',
                    }}
                />

                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {sponsor.name}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => setStatsModalOpen(true)} color="primary">
                        <BarChartIcon />
                    </IconButton>
                    <IconButton size="small" onClick={onEdit} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={onDelete} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Paper>

            <SponsorStatsModal
                open={statsModalOpen}
                onClose={() => setStatsModalOpen(false)}
                scopeId={scopeId}
                sponsorId={sponsor.id}
                sponsorName={sponsor.name}
            />
        </>
    )
}
