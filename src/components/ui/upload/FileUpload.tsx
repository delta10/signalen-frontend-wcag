import React, { Ref, useRef, useState } from 'react'
import { IconCirclePlus } from '@tabler/icons-react'
import PreviewFile from '@/components/ui/upload/PreviewFile'
import { useTranslations } from 'next-intl'
import {
  Alert,
  ButtonGroup,
  Icon,
  Paragraph,
  SecondaryActionButton,
  UnorderedList,
  UnorderedListItem,
} from '@/components'
import { useFormContext } from 'react-hook-form'

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
]

enum UploadStatus {
  NONE = 0,
  LOADING,
  SUCCESS,
  FAILED,
}

export const MAX_FILE_SIZE = 20971520
export const MIN_FILE_SIZE = 30720
export const MAX_NUMBER_FILES = 5

type FileUploadProps = {
  onChange: () => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: (index: number) => void
  files: File[]
  fileRefs: Ref<HTMLButtonElement>[]
}

export const FileUpload = React.forwardRef<HTMLLabelElement, FileUploadProps>(
  ({ ...props }, ref) => {
    const [labelHovered, setLabelHovered] = useState(false)
    const t = useTranslations('general')
    const { setValue, getValues } = useFormContext()
    const [refObject, setRefObject] = useState({})

    const files: File[] = getValues('files')

    const numberOfEmtpy = MAX_NUMBER_FILES - files.length - 1
    const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()]

    const [fileUploadStatus, setFileUploadStatus] = useState<UploadStatus>(
      UploadStatus.NONE
    )

    const [deletedFile, setDeletedFile] = useState<File | null>(null)
    const uploadAlertRef = useRef<HTMLDivElement | null>(null)
    const deleteAlertRef = useRef<HTMLDivElement | null>(null)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setFileUploadStatus(UploadStatus.NONE)
        setDeletedFile(null)
        document.getElementById('fileUpload')?.click()
      }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setFileUploadStatus(UploadStatus.NONE)
        const files = e.target.files

        if (files && files.length > 0) {
          const filesArray = getValues('files')
            .concat(Array.from(files))
            .slice(0, MAX_NUMBER_FILES)
          setValue('files', filesArray)
        }

        setFileUploadStatus(UploadStatus.SUCCESS)
        setTimeout(() => {
          uploadAlertRef.current?.focus()
        }, 0)
      } catch (error) {
        console.error('Error while handling file change:', error)
        setFileUploadStatus(UploadStatus.FAILED)
      }
    }

    const deleteFile = (index: number) => {
      setDeletedFile(files[index])
      const updatedFiles = files.filter((_, i) => i !== index)
      setValue('files', updatedFiles)
      deleteAlertRef.current?.focus()
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 flex-wrap">
          {files.length > 0 &&
            files
              .slice(0, MAX_NUMBER_FILES)
              .map((image, index) => (
                <PreviewFile
                  file={image}
                  refObject={refObject}
                  setRefObject={setRefObject}
                  index={index}
                  onDelete={() => deleteFile(index)}
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
                aria-label={
                  files.length === 0
                    ? t('button.upload_file')
                    : t('button.upload_extra_file')
                }
                onMouseEnter={() => setLabelHovered(true)}
                onMouseLeave={() => setLabelHovered(false)}
                onKeyDown={(e) => handleKeyDown(e)}
                onClick={() => {
                  setFileUploadStatus(UploadStatus.NONE)
                  setDeletedFile(null)
                }}
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
                onChange={handleFileChange}
                multiple
              />
            </div>
          )}
          {empty.map((key) => (
            <div className="empty-box border" key={key} />
          ))}
        </div>
        {deletedFile !== null && (
          <Alert ref={deleteAlertRef} tabIndex={0}>
            <Paragraph>{t('file.delete_successful')}</Paragraph>
            <UnorderedList className="pb-3">
              <UnorderedListItem>{deletedFile.name}</UnorderedListItem>
            </UnorderedList>
            <ButtonGroup>
              <SecondaryActionButton onClick={() => setDeletedFile(null)}>
                Sluit
              </SecondaryActionButton>
            </ButtonGroup>
          </Alert>
        )}
        {files.length > 0 && UploadStatus.SUCCESS === fileUploadStatus && (
          <Alert ref={uploadAlertRef} tabIndex={0}>
            <Paragraph>{t('file.upload_successful')}</Paragraph>
            <UnorderedList className="pb-3">
              {files.map((file, index) => (
                <UnorderedListItem key={index}>{file.name}</UnorderedListItem>
              ))}
            </UnorderedList>
            <ButtonGroup>
              <SecondaryActionButton
                aria-label={t('button.close_alert')}
                onClick={() => setFileUploadStatus(UploadStatus.NONE)}
              >
                Sluit
              </SecondaryActionButton>
            </ButtonGroup>
          </Alert>
        )}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
