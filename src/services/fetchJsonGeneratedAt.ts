export const fetchJsonGeneratedAt = async (url: string) => {
    try {
        const response = await fetch(url)
        const json = await response.json()
        return json.generatedAt
    } catch (error) {
        console.error(error)
        return 'Error while fetching, see console'
    }
}
