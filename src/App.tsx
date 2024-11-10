import { useMemo } from 'react'
import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { Route, Router, Switch } from 'wouter'
import { LinkProps } from '@mui/material/Link'
import { LinkBehavior } from './components/CCLink'
import { Home } from './Home.tsx'
import { Login } from './Login.tsx'
import { Dashboard } from './dashboard/Dashboard.tsx'
import { UserProvider } from './services/UserProvider.tsx'
import { NotificationProvider } from './notifications/NotificationProvider.tsx'

export const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                    primary: {
                        main: '#00B19D',
                    },
                    secondary: {
                        main: '#F8B904',
                    },
                    divider: prefersDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                },
                components: {
                    MuiLink: {
                        defaultProps: {
                            component: LinkBehavior,
                        } as LinkProps,
                    },
                    MuiButtonBase: {
                        defaultProps: {
                            LinkComponent: LinkBehavior,
                        },
                    },
                    MuiListItemButton: {
                        // not working as of March 2023: https://github.com/mui/material-ui/pull/34159
                        defaultProps: {
                            LinkComponent: LinkBehavior,
                        },
                    },
                },
            }),
        [prefersDarkMode]
    )

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <NotificationProvider>
                    <UserProvider>
                        <CssBaseline />

                        <Switch>
                            <Route path="/" component={Home} />
                            <Login>
                                <Switch>
                                    <Route path="/dashboard" component={Dashboard} />
                                    <Route>
                                        404: No such page!
                                        <a href="/dashboard">Go to dashboard</a>
                                    </Route>
                                </Switch>
                            </Login>
                            <Route>404: No such page!</Route>
                        </Switch>
                    </UserProvider>
                </NotificationProvider>
            </ThemeProvider>
        </Router>
    )
}
