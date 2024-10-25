import React, { useEffect, useState } from 'react'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useTranslations } from 'next-intl'

type Props = {
  file: File
  allowDelete?: boolean
  onDelete?: () => void
}

const PreviewFile = ({ file, allowDelete = false, onDelete }: Props) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const t = useTranslations('general.button')

  useEffect(() => {
    const objectUrl = file['name'] ? URL.createObjectURL(file) : ''
    setImageUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl) // Clean up memory on unmount
  }, [file])

  return (
    <div className="relative">
      <img className="empty-box" src={imageUrl} alt="Voorbeeld weergave" />
      {allowDelete && (
        <button
          onClick={onDelete}
          aria-label={t('delete_file')}
          className="absolute bottom-0 right-0 bg-gray-900 bg-opacity-50 text-white w-full flex justify-center items-center py-2 hover:bg-opacity-80 transition-colors duration-200 delay-100"
        >
          <FaRegTrashCan className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default PreviewFile
