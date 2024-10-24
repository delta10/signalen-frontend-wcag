import React, { useState } from 'react'
// import { cn } from '@/lib/utils/style'
import { IoAddCircleOutline } from 'react-icons/io5'
import { FieldValues, UseFormReturn } from 'react-hook-form'

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
]
export const MAX_FILE_SIZE = 20971520
export const MIN_FILE_SIZE = 30720
const MAX_NUMBER_FILES = 3

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

  const numberOfEmtpy = MAX_NUMBER_FILES - nrOfFiles - 1
  const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const filesArray = Array.from(files)
      form.setValue('files', filesArray)
      setNrOfFiles(filesArray.length)
    }
  }

  console.log('in file upload', form.getValues('files'))

  // @ts-ignore
  return (
    <div className="flex">
      {form.getValues('files')?.length > 0 &&
        form
          .getValues('files')
          .map((image, index) => (
            <img
              key={index}
              className="empty-box"
              src={URL.createObjectURL(image)}
              alt={'voorbeeld weergave'}
            />
          ))}
      {nrOfFiles < MAX_NUMBER_FILES && (
        <div className="file-upload-box">
          <label htmlFor="fileUpload" className="flex" tabIndex={0}>
            <span className="flex justify-center items-center h-full">
              <IoAddCircleOutline className="w-14 h-14" />
            </span>
          </label>
          <input
            id="fileUpload"
            type="file"
            className="hidden"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            {...register('files', { required: false })}
            onChange={handleFileChange} // Handle file selection immediately
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
