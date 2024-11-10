import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { ImageTextFieldElement } from '../../components/form/ImageTextFieldElement.tsx'
import { useForm } from 'react-hook-form'
import { Sponsor } from '../../types.ts'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { LoadingButton } from '@mui/lab'

interface AddSponsorModalProps {
    scopeId: string
    sponsor?: Sponsor | null
    open: boolean
    onClose: () => void
    onSubmit: (sponsorData: { name: string; website: string; logo: string }, isEdit?: boolean) => void
}

export const AddSponsorModal = ({ open, onClose, sponsor, scopeId, onSubmit }: AddSponsorModalProps) => {
    const formContext = useForm({
        defaultValues: sponsor
            ? ({
                  ...sponsor,
                  name: sponsor.name || undefined,
                  logo: sponsor.logo || undefined,
                  website: sponsor.website || undefined,
              } as Sponsor)
            : ({} as Sponsor),
    })

    const { formState } = formContext

    const isSubmitting = formState.isSubmitting
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add new Sponsor</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <FormContainer
                        formContext={formContext}
                        onSuccess={async (data) => {
                            const objectToSave: {
                                website: string
                                logo: string
                                name: string
                                id?: string
                            } = {
                                website: data.website,
                                logo: data.logo,
                                name: data.name,
                            }
                            if (sponsor) {
                                objectToSave.id = sponsor.id
                            }
                            return onSubmit(objectToSave, !!sponsor)
                        }}
                    >
                        <TextFieldElement
                            margin="dense"
                            fullWidth
                            label="Sponsor Name"
                            name="name"
                            variant="filled"
                            required
                        />
                        <TextFieldElement
                            margin="dense"
                            fullWidth
                            label="Website url"
                            name="website"
                            variant="filled"
                            required
                        />
                        <ImageTextFieldElement
                            scopeId={scopeId}
                            margin="dense"
                            fullWidth
                            label="Image URL"
                            name="logo"
                            variant="filled"
                            disabled={isSubmitting}
                            maxImageSize={1500}
                            fileSuffix={sponsor?.name}
                        />
                        <LoadingButton
                            type="submit"
                            disabled={formState.isSubmitting}
                            loading={formState.isSubmitting}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            {sponsor ? 'Save' : 'Add sponsor'}
                        </LoadingButton>
                    </FormContainer>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
