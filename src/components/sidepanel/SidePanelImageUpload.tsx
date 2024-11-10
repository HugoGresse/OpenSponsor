import { useCallback, useEffect, useState } from 'react'
import { SidePanel } from './SidePanel'
import { useDropzone } from 'react-dropzone'
import { SidePanelImageUploadForm } from './SidePanelImageUploadForm'
import { resizeImage } from '../../utils/images/resizeImage'
import { uploadImage } from '../../utils/images/uploadImage'
import { useController } from 'react-hook-form'
import { useClipboardImage } from '../useClipboardImage.ts'
import { useNotification } from '../../notifications/useNotification.ts'

export type SidePanelImageUploadProps = {
    storageDestination: string
    publicStorageUrl: string
    isOpen: boolean
    onClose: () => void
    title: string
    fieldName: string
    maxImageSize: number
}
export const SidePanelImageUpload = ({
    storageDestination,
    publicStorageUrl,
    isOpen,
    onClose,
    title,
    fieldName,
    maxImageSize = 500,
}: SidePanelImageUploadProps) => {
    const { field } = useController({ name: fieldName })
    const { createNotification } = useNotification()
    const [upload, setUpload] = useState<{
        file: File
        preview: string
    } | null>(null)
    const [uploading, setUploading] = useState(false)

    const imageFromClipboard = useClipboardImage(isOpen)

    useEffect(() => {
        if (imageFromClipboard && !upload) {
            setUpload({
                file: imageFromClipboard,
                preview: URL.createObjectURL(imageFromClipboard),
            })
        }
    }, [imageFromClipboard, upload])

    const onSave = async () => {
        setUploading(true)

        try {
            if (upload) {
                const resizedImage = await resizeImage(upload.file, maxImageSize)
                const imagePath = await uploadImage(storageDestination, resizedImage, upload.file)
                const publicUrl = `${publicStorageUrl}/${imagePath}`
                field.onChange(publicUrl)
            }

            onClose()
        } catch (error) {
            createNotification('Error while resizing image or uploading it (check JS console?)', { type: 'error' })
            console.log(error)
        }

        setUploading(false)
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setUpload({
                file: acceptedFiles[0],
                preview: URL.createObjectURL(acceptedFiles[0]),
            })
        }
    }, [])

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        noClick: true,
        noKeyboard: true,
        accept: {
            'image/jpeg': ['.png', '.jpg', '.jpeg'],
            'image/png': ['.png', '.jpg', '.jpeg'],
            'image/svg+xml': ['.svg'],
        },
    })

    return (
        <SidePanel onClose={onClose} isOpen={isOpen} title={title} containerProps={getRootProps()}>
            <SidePanelImageUploadForm
                uploading={uploading}
                isDragActive={isDragActive}
                file={upload}
                getInputProps={getInputProps}
                fieldName={fieldName}
                onInputClick={open}
                onSaveClick={onSave}
                helpText="PNG or JPEG image, will be resized in the browser. You can also paste image directly from clipboard."
            />
        </SidePanel>
    )
}
