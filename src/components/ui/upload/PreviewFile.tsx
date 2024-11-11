import React, { useEffect, useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

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
        alt={t('file.preview')}
      />
      {allowDelete && (
        <button
          onClick={onDelete}
          aria-label={t('button.delete_file')}
          className="absolute bottom-0 right-0 bg-gray-900 bg-opacity-50 text-white w-full flex justify-center items-center py-2 hover:bg-opacity-80 transition-colors duration-200 delay-100"
        >
          {/* TODO: create IconButton to put around Icon */}
          <IconTrash className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default PreviewFile
