import { Dialog, DialogContent, DialogTitle, Grid2, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Project } from '../../types.ts'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { LoadingButton } from '@mui/lab'

interface AddProjectModalProps {
    project?: Project | null
    open: boolean
    onClose: () => void
    onSubmit: (projectData: { name: string; url: string; id: string }, isEdit?: boolean) => void
}

export const AddProjectModal = ({ project, open, onClose, onSubmit }: AddProjectModalProps) => {
    const formContext = useForm({
        defaultValues: project
            ? ({
                  ...project,
                  url: project.url || undefined,
                  name: project.name || undefined,
                  id: project.id || undefined,
              } as Project)
            : ({} as Project),
    })

    const { formState } = formContext

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <FormContainer
                        formContext={formContext}
                        onSuccess={async (data) => {
                            return onSubmit(
                                {
                                    url: data.url,
                                    name: data.name,
                                    id: data.id,
                                },
                                !!project
                            )
                        }}
                    >
                        <Grid2 container spacing={4}>
                            <TextFieldElement
                                margin="dense"
                                fullWidth
                                label="Project id (probaly like some-project-id)"
                                name="id"
                                variant="filled"
                                required
                            />
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <TextFieldElement
                                    margin="dense"
                                    fullWidth
                                    label="Project Name"
                                    name="name"
                                    variant="filled"
                                    required
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <TextFieldElement
                                    margin="dense"
                                    fullWidth
                                    label="Project url"
                                    name="url"
                                    variant="filled"
                                    type="url"
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <LoadingButton
                                    type="submit"
                                    disabled={formState.isSubmitting}
                                    loading={formState.isSubmitting}
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    {project ? 'Save' : 'Add project'}
                                </LoadingButton>
                            </Grid2>
                        </Grid2>
                    </FormContainer>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
