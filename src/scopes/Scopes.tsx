import { Box } from '@mui/material'
import { Scope } from '../types.ts'
import { ScopeItem } from './ScopeItem.tsx'

export const Scopes = ({ scopes, reloadScopes }: { scopes: Scope[]; reloadScopes: () => void }) => {
    return (
        <Box>
            {scopes.map((scope) => (
                <ScopeItem key={scope.id} scope={scope} reloadScope={reloadScopes} />
            ))}
        </Box>
    )
}
