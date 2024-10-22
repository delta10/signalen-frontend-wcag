'use client'

import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from '@/components/ui/Form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Textarea } from '@/components/ui/TextArea'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import {
  useSignalAttachmentStore,
  useSignalStore,
  useStepperStore,
} from '@/store/store'
import { useRouter } from '@/routing/navigation'
import React, { useState } from 'react'

export const IncidentDescriptionForm = () => {
  const t = useTranslations('describe-report.form')
  const { updateSignal, signal } = useSignalStore()
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const { updateAttachments, attachments } = useSignalAttachmentStore()
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ]
  const MAX_FILE_SIZE = 20971520
  const MIN_FILE_SIZE = 30720

  const incidentDescriptionFormSchema = z.object({
    description: z.string().min(1, t('errors.textarea_required')),
    files: z
      .array(z.instanceof(File))
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        {
          message: t('errors.file_type_invalid'),
        }
      )
      .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
        message: t('errors.file_size_too_large'),
      })
      .refine((files) => files.every((file) => file.size >= MIN_FILE_SIZE), {
        message: t('errors.file_size_too_small'),
      }),
  })

  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      description: signal.text,
      files: images,
    },
  })
  const {
    register,
    formState: { errors },
  } = form

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    updateSignal({
      ...signal,
      text: values.description,
    })

    if (images.length > 0) {
      updateAttachments(images)
    }

    setLastCompletedStep(1)
    addOneStep()

    router.push('/incident/add')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const filesArray = Array.from(files)
      form.setValue('files', filesArray)
      setImages(filesArray)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-start"
      >
        <FormField
          name={'description'}
          control={form.control}
          render={({ field, formState: { errors } }) => (
            <FormItem error={errors.description}>
              <div>
                <FormLabel>{t('describe_textarea_heading')}</FormLabel>
                <FormDescription>
                  {t('describe_textarea_description')}
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={'files'}
          control={form.control}
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <div>
                <FormLabel>{t('describe_upload_heading')}</FormLabel>
                <FormDescription>
                  {t('describe_upload_description')}
                </FormDescription>
                <FormMessage />
              </div>
              <div className="flex ">
                <div className="empty-box" />
                <FormControl>
                  {/*<FileInput value={images} onChange={handleChange} />*/}
                  <div className="file-upload-box">
                    <label htmlFor="fileUpload">
                      <span>upload icon</span>
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
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        {/* aar eigen component
                // this.imageFieldValues[id].previewUrl = URL.createObjectURL(file); //
        todo: gebruik tw read onl
        */}

        <IncidentFormFooter />
      </form>
    </Form>
  )
}
