import React from 'react'
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

type FileUploadProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues> // UseFormReturn type from react-hook-form
}

export const FileUpload = <TFormValues extends FieldValues>({
  form,
}: FileUploadProps<TFormValues>) => {
  const { register, setValue, getValues } = form

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const filesArray = Array.from(files)
      // @ts-ignore
      form.setValue('files', filesArray)
    }
  }

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
      <div className="empty-box" />
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
    </div>
  )
}

FileUpload.displayName = 'FileUpload'
