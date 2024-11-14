import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { IconButton } from '@/components'
import { IconTrash } from '@tabler/icons-react'

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
      <img
        className="empty-box object-cover"
        src={imageUrl}
        alt={t('file.preview', { file: file.name })}
      />
      {allowDelete && (
        <IconButton
          className="iconbutton-trash absolute bottom-0 right-0 w-full flex justify-center items-center py-2"
          // absolute bottom-0 bg-gray-900 bg-opacity-50 text-white w-full flex justify-center items-center py-2 hover:bg-opacity-80 transition-colors duration-200 delay-100
          onClick={onDelete}
          type="button"
          label={t('button.delete_file')}
        >
          <IconTrash className="iconbutton__icon" />
        </IconButton>
      )}
    </div>
  )
}

export default PreviewFile
