import { Box, IconButton, Paper, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Sponsor } from '../types'

interface SponsorItemProps {
    sponsor: Sponsor
    onEdit: () => void
    onDelete: () => void
}

export const SponsorItem = ({ sponsor, onEdit, onDelete }: SponsorItemProps) => {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                maxWidth: '400px',
            }}
        >
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
                <IconButton size="small" onClick={onEdit} color="primary">
                    <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={onDelete} color="error">
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Paper>
    )
}
