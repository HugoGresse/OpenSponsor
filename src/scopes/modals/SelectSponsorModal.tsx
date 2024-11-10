import {
    Box,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    DialogTitle,
    Stack,
    DialogContent,
    Dialog,
} from '@mui/material'
import { useCallback, useState } from 'react'

interface Sponsor {
    id: string
    name: string
}

interface SelectSponsorModalProps {
    open: boolean
    onClose: () => void
    sponsorIds: string[]
    sponsors: Sponsor[]
    onSelect: (selectedSponsors: string[]) => void
}

export const SelectSponsorModal = ({ open, onClose, sponsorIds = [], sponsors, onSelect }: SelectSponsorModalProps) => {
    const [selectedSponsors, setSelectedSponsors] = useState<string[]>(sponsorIds)

    const handleToggleSponsor = (sponsorId: string) => {
        setSelectedSponsors((prev) =>
            prev.includes(sponsorId) ? prev.filter((id) => id !== sponsorId) : [...prev, sponsorId]
        )
    }

    const handleSubmit = useCallback(() => {
        onSelect(selectedSponsors)
        onClose()
    }, [selectedSponsors, onSelect, onClose])

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Select Sponsors</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <FormGroup>
                        {sponsors.map((sponsor) => (
                            <FormControlLabel
                                key={sponsor.id}
                                control={
                                    <Checkbox
                                        checked={selectedSponsors.includes(sponsor.id)}
                                        onChange={() => handleToggleSponsor(sponsor.id)}
                                    />
                                }
                                label={sponsor.name}
                            />
                        ))}
                    </FormGroup>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            Confirm
                        </Button>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
