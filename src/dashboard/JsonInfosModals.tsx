import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { Scope } from '../types.ts'
import { useState } from 'react'
import { useDeploy } from '../services/useDeploy.ts'
import { TypographyCopyable } from '../components/TypographyCopyable.tsx'
import { getRelativeTime } from '../utils/getRelativeTime.ts'

export const JsonInfosModals = ({ scope, reloadScope }: { scope: Scope; reloadScope: () => void }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const { deploy, isDeploying, error, lastDeployedAt } = useDeploy(scope, modalOpen)

    const jsonAvailable = scope.scopeJsonUrl && scope.scopeJsonUrl.length > 0

    return (
        <>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
                Deploy
            </Button>
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Deploy and Static API</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            disabled={isDeploying}
                            onClick={() => {
                                deploy().then(() => {
                                    reloadScope()
                                })
                            }}>
                            {isDeploying ? 'Deploying...' : 'Deploy'}
                        </Button>

                        {jsonAvailable && (
                            <Box sx={{ mt: 2 }}>
                                <Typography>
                                    Last deployed at {lastDeployedAt}, {getRelativeTime(lastDeployedAt)}
                                </Typography>
                            </Box>
                        )}

                        {error && (
                            <Box sx={{ mt: 2 }}>
                                <Typography color="error">Error while deploying</Typography>
                                <Typography color="error">{error.message}</Typography>
                            </Box>
                        )}

                        {jsonAvailable && (
                            <Box sx={{ mt: 2 }}>
                                <Typography>Global scope JSON URL</Typography>
                                <TypographyCopyable>{scope.scopeJsonUrl}</TypographyCopyable>
                                {scope.projects.map((project) => (
                                    <Box key={project.id} sx={{ mt: 2 }}>
                                        <Typography>- {project.name} JSON URL</Typography>
                                        <TypographyCopyable key={project.id}>
                                            {project.projectJsonUrl}
                                        </TypographyCopyable>
                                    </Box>
                                ))}

                                <Box bgcolor={'#88888888'} p={1} mt={2} borderRadius={1}>
                                    <Typography>
                                        ⚠️ You may want to add a cache busting param to the url to force refresh the
                                        cache: "?t=Date.now()", otherwise there is a 1h cache.
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {!jsonAvailable && (
                            <Box sx={{ mt: 2 }}>
                                <Typography>
                                    Deploy a first version of your scope to get a static JSON API url.
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}
