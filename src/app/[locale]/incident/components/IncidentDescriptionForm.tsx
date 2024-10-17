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

  const incidentDescriptionFormSchema = z.object({
    description: z.string().min(1, t('errors.textarea_required')),
    files: z.any(),
  })

  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      description: signal.text,
    },
  })

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
        {/*<FormField*/}
        {/*  name={'files'}*/}
        {/*  control={form.control}*/}
        {/*  render={({ field, formState: { errors } }) => (*/}
        {/*    <FormItem>*/}
        {/*      <div>*/}
        {/*        <FormLabel>{t('describe_upload_heading')}</FormLabel>*/}
        {/*        <FormDescription>*/}
        {/*          {t('describe_upload_description')}*/}
        {/*        </FormDescription>*/}
        {/*        <FormMessage />*/}
        {/*      </div>*/}
        {/*      <FormControl>*/}
        {/*        /!* TODO: put onChange handler on file upload, or provide defaultValue (bind to react-hook-form). To prevent error *!/*/}
        {/*        <FileInput value={images} onChange={handleChange} />*/}
        {/*      </FormControl>*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}
        {/*<FileInputUncontrolled />*/}
        <label htmlFor="fileUpload">kies iets moois</label>
        <input
          name={'fileUpload'}
          type="file"
          onChange={handleFileChange} // Handle file selection immediately
          multiple
        />
        <IncidentFormFooter />
      </form>
    </Form>
  )
}
