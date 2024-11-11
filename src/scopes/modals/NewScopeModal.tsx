import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'

export const NewScopeModal = ({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (name: string) => void
}) => {
    const [name, setName] = useState('')
    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault()
                        const formData = new FormData(event.currentTarget)
                        const formJson = Object.fromEntries((formData as FormData).entries())
                        const scope = formJson.scope as string
                        onSubmit(scope)
                    },
                }}>
                <DialogTitle>New scope</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        A scope is a pair between projects and sponsors. Each scope will have a name and a list of
                        sponsors.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="scope"
                        label="Scope name"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Add scope</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
