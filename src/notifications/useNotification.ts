import { useContext } from 'react'
import { NotificationContext } from './NotificationProvider.tsx'

export const useNotification = () => useContext(NotificationContext)
