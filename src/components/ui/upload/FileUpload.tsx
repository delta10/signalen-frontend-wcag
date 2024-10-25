import React, { useState } from 'react'
import { IoAddCircleOutline } from 'react-icons/io5'
import { FieldValues, UseFormReturn } from 'react-hook-form'
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

interface FormWithFiles extends FieldValues {
  files: File[]
}

type FileUploadProps = {
  form: UseFormReturn<FormWithFiles> // UseFormReturn type from react-hook-form
}

export const FileUpload = ({ form }: FileUploadProps) => {
  const { register } = form
  const [nrOfFiles, setNrOfFiles] = useState(
    form.getValues('files') ? form.getValues('files').length : 0
  )
  const [labelHovered, setLabelHovered] = useState(false)
  const t = useTranslations('general.button')

  const numberOfEmtpy = MAX_NUMBER_FILES - nrOfFiles - 1
  const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const filesArray = form
        .getValues('files')
        .concat(Array.from(files))
        .slice(0, MAX_NUMBER_FILES)
      form.setValue('files', filesArray)
      setNrOfFiles(filesArray.length)
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = form.getValues('files').filter((_, i) => i !== index)
    form.setValue('files', updatedFiles)
    setNrOfFiles(updatedFiles.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    console.log(e.key)
    if (e.key === 'Enter' || e.key === ' ') {
      document.getElementById('fileUpload')?.click()
    }
  }

  // @ts-ignore
  return (
    <div className="flex gap-4">
      {form.getValues('files')?.length > 0 &&
        form
          .getValues('files')
          .slice(0, MAX_NUMBER_FILES)
          .map((image, index) => (
            <PreviewFile
              file={image}
              onDelete={() => removeFile(index)}
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
            {...register('files', { required: false })}
            onChange={handleFileChange}
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

FileUpload.displayName = 'FileUpload'
