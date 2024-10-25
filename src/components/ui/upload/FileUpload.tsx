import React, { useEffect, useState } from 'react'
import { IoAddCircleOutline } from 'react-icons/io5'
import PreviewFile from '@/components/ui/upload/PreviewFile'
import { useTranslations } from 'next-intl'

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
]

export const MAX_FILE_SIZE = 20971520
export const MIN_FILE_SIZE = 30720
export const MAX_NUMBER_FILES = 5

type FileUploadProps = {
  onChange: () => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: (index: number) => void
  files: File[]
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ onFileUpload, onDelete, files, ...props }, ref) => {
    const [nrOfFiles, setNrOfFiles] = useState(files.length)
    const [labelHovered, setLabelHovered] = useState(false)
    const t = useTranslations('general.button')

    const numberOfEmtpy = MAX_NUMBER_FILES - nrOfFiles - 1
    const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()]

    useEffect(() => {
      setNrOfFiles(files.length)
    }, [files])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        document.getElementById('fileUpload')?.click()
      }
    }

    return (
      <div ref={ref} className="flex gap-4">
        {files.length > 0 &&
          files
            .slice(0, MAX_NUMBER_FILES)
            .map((image, index) => (
              <PreviewFile
                file={image}
                onDelete={() => onDelete(index)}
                allowDelete={true}
                key={index}
              />
            ))}

        {nrOfFiles < MAX_NUMBER_FILES && (
          <div className="file-upload-box">
            <label
              htmlFor="fileUpload"
              className="flex"
              tabIndex={0}
              aria-label={t('upload_file')}
              onMouseEnter={() => setLabelHovered(true)}
              onMouseLeave={() => setLabelHovered(false)}
              onKeyDown={(e) => handleKeyDown(e)}
            >
              <span className="flex justify-center items-center h-full relative">
                <IoAddCircleOutline
                  className={`transition-all duration-300 ${
                    labelHovered ? 'w-16 h-16' : 'w-14 h-14'
                  }`}
                />
              </span>
            </label>
            <input
              id="fileUpload"
              type="file"
              className="hidden"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={onFileUpload}
              multiple
            />
          </div>
        )}
        {empty.map((key) => (
          <div className="empty-box border" key={key} />
        ))}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
