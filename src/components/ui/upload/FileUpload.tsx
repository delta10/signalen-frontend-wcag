import React, { useState } from 'react'
import { IconCirclePlus } from '@tabler/icons-react'
import PreviewFile from '@/components/ui/upload/PreviewFile'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components'

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

export const FileUpload = React.forwardRef<HTMLLabelElement, FileUploadProps>(
  ({ onFileUpload, onDelete, files, ...props }, ref) => {
    const [labelHovered, setLabelHovered] = useState(false)
    const t = useTranslations('general.button')

    const numberOfEmtpy = MAX_NUMBER_FILES - files.length - 1
    const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()]

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        document.getElementById('fileUpload')?.click()
      }
    }

    return (
      <div className="flex gap-4 flex-wrap">
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

        {files.length < MAX_NUMBER_FILES && (
          <div className="file-upload-box">
            <label
              htmlFor="fileUpload"
              className="flex"
              ref={ref}
              tabIndex={0}
              aria-label={t('upload_file')}
              onMouseEnter={() => setLabelHovered(true)}
              onMouseLeave={() => setLabelHovered(false)}
              onKeyDown={(e) => handleKeyDown(e)}
            >
              <span className="flex justify-center items-center h-full relative">
                <Icon
                  className={`transition-all duration-300 ${
                    labelHovered ? '!w-16 !h-16' : '!w-14 !h-14'
                  }`}
                >
                  <IconCirclePlus />
                </Icon>
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
