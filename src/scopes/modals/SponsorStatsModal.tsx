import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useSponsorStats } from '../../services/useSponsorStats'
import { CircularProgress } from '@mui/material'

interface SponsorStatsModalProps {
    open: boolean
    onClose: () => void
    scopeId: string
    sponsorId: string
    sponsorName: string
}

export const SponsorStatsModal = ({ open, onClose, scopeId, sponsorId, sponsorName }: SponsorStatsModalProps) => {
    const { data: stats, isLoading } = useSponsorStats(scopeId, sponsorId)

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date)
    }

    const formatMonthName = (month: string) => {
        // Convert month number to Date object (month is 0-based in JS)
        const date = new Date(2000, parseInt(month) - 1, 1)
        return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Stats for {sponsorName}</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : stats ? (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Total Clicks: {stats.totalClicks}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Last Updated: {formatDate(stats.lastUpdated.toDate())}
                        </Typography>
                        <Typography variant="h6" gutterBottom mt={2}>
                            Monthly Breakdown
                        </Typography>
                        {Object.entries(stats.aggregate).map(([year, yearData]) => (
                            <Box key={year} mt={2}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {year} (Total: {yearData.total})
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {Object.entries(yearData)
                                        .filter(([month]) => month !== 'total')
                                        .map(([month, clicks]) => (
                                            <Box
                                                key={month}
                                                p={1}
                                                bgcolor="primary.light"
                                                borderRadius={1}
                                                minWidth={80}
                                                textAlign="center">
                                                <Typography variant="body2">{formatMonthName(month)}</Typography>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {clicks}
                                                </Typography>
                                            </Box>
                                        ))}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography>No stats available yet</Typography>
                )}
            </DialogContent>
        </Dialog>
    )
}
