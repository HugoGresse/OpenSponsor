import { getOpenSponsorAuth } from './services/firebase.ts'
// @ts-expect-error no types
import FirebaseUIReact from 'firebaseui-react'
import { Box, Container, Typography, useTheme } from '@mui/material'
import { useLocation } from 'wouter'
import { useUser } from './services/useUser.tsx'
import React from 'react'

export const Login = ({ children }: { children: React.ReactNode }) => {
    const { userId } = useUser()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setLocation] = useLocation()
    const theme = useTheme()

    if (userId) {
        return children
    }

    const config = {
        continueUrl: '/auth',
        signInOptions: [
            {
                provider: 'emailpassword',
                signInFlow: 'popup',
                customStyles: { color: theme.palette.primary.main },
            },
            {
                provider: 'google.com',
                signInFlow: 'popup',
                customStyles: { color: theme.palette.primary.main },
            },
        ],
        formButtonStyles: { color: theme.palette.primary.main },
        formInputStyles: { color: theme.palette.primary.main },
        formLabelStyles: { color: theme.palette.primary.main },
        formSmallButtonStyles: { color: theme.palette.primary.main },
        callbacks: {
            signInSuccessWithAuthResult: () => {
                setLocation('/dashboard')
            },
            signInFailure: (error: object) => {
                //custom error handling
                console.error(error)
            },
        },
    }

    return (
        <Container>
            <Box minHeight="100vh" maxWidth={500} margin="auto">
                <Typography variant="h2" component="h1" gutterBottom>
                    Login
                </Typography>
                <FirebaseUIReact auth={getOpenSponsorAuth()} config={config} />
            </Box>
        </Container>
    )
}
