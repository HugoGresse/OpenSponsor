import { Box, Button } from '@mui/material'

export const Home = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            minHeight="100vh"
        >
            <h1>Open Sponsor</h1>
            <p>
                Open source sponsorship platform to manage your platform by scope and provide a .json to use in your
                apps/projets
            </p>

            <Button href="/dashboard" variant="contained">
                Login or Register
            </Button>
        </Box>
    )
}
