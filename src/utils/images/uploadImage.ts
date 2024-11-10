import { ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../services/firebase'
import { v4 as uuidv4 } from 'uuid'

export const uploadImage = async (storageDestination: string, image: Blob, originalFile: File) => {
    const actualFileName = originalFile.name.slice(0, 15)
    const fileName = `${uuidv4()}_${actualFileName}`
    const storagePath = `${storageDestination}${fileName}`

    const outputRef = ref(storage, storagePath)

    await uploadBytes(outputRef, image, {})
    return storagePath
}
