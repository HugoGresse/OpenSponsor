export const getRelativeTime = (isoString: string): string => {
    try {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
        const diff = Date.now() - new Date(isoString).getTime()
        const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24))
        const diffInHours = Math.floor(diff / (1000 * 60 * 60))
        const diffInMinutes = Math.floor(diff / (1000 * 60))

        if (diffInDays > 0) return rtf.format(-diffInDays, 'day')
        if (diffInHours > 0) return rtf.format(-diffInHours, 'hour')
        return rtf.format(-diffInMinutes, 'minute')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        return ''
    }
}
