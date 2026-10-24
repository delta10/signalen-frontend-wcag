import NextImage from 'next/image'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components'
import { IconTrash } from '@tabler/icons-react'
import './PreviewFile.css'

type Props = {
  file: File
  allowDelete?: boolean
  onDelete?: () => void
}

const PreviewFile = ({ file, allowDelete = false, onDelete }: Props) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const t = useTranslations('general')

  useEffect(() => {
    const objectUrl = file['name'] ? URL.createObjectURL(file) : ''
    setImageUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl) // Clean up memory on unmount
  }, [file])

  return (
    <div className="relative">
      {imageUrl ? (
        <NextImage
          unoptimized
          width={100}
          height={100}
          className="empty-box object-cover"
          src={imageUrl}
          alt={t('file.preview', { file: file.name })}
        />
      ) : (
        <div className="empty-box" />
      )}
      {/*          className="absolute bottom-0 right-0 w-full flex justify-center items-center py-2 file-preview-button-background"*/}
      {allowDelete && (
        <Button
          className="iconbutton-preview-delete"
          onClick={onDelete}
          type="button"
          iconOnly
          iconStart={<IconTrash />}
          label={t('button.delete_file', { file: file.name })}
        />
      )}
    </div>
  )
}

export default PreviewFile
