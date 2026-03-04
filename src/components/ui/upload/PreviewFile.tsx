import React, { useEffect, useState } from 'react'
import Image from 'next/image'
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
    const objectUrl = file?.name ? URL.createObjectURL(file) : ''
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setImageUrl(objectUrl)
    })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return (
    <div className="relative">
      {imageUrl ? (
        /* width/height match .empty-box (100px). object-cover prevents stretching. */
        <Image
          src={imageUrl}
          alt={t('file.preview', { file: file.name })}
          width={100}
          height={100}
          className="empty-box object-cover"
          unoptimized
        />
      ) : (
        <div className="empty-box object-cover" aria-hidden />
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
