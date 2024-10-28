'use client'

import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/Form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useStepperStore } from '@/store/stepper_store'
import { useRouter } from '@/routing/navigation'
import { useEffect, useRef } from 'react'
import { getCategoryForDescription } from '@/services/classification'
import { debounce } from 'lodash'
import { useFormStore } from '@/store/form_store'
import React from 'react'
import {
  ACCEPTED_IMAGE_TYPES,
  FileUpload,
  MAX_FILE_SIZE,
  MAX_NUMBER_FILES,
  MIN_FILE_SIZE,
} from '@/components/ui/upload/FileUpload'

import { FormFieldTextarea } from '@utrecht/component-library-react/dist/css-module'
import { FileInput, Label } from '@amsterdam/design-system-react'

export const IncidentDescriptionForm = () => {
  const t = useTranslations('describe-report.form')
  const { updateForm, formState } = useFormStore()
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/incident/add')
  }, [router])

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

  const getAttachments = () => {
    // When the browser is refreshed the files are not properly stored in the localstorage.
    // Therefor, we check if the file object is still of type File.
    const filesArray = formState.attachments.filter(
      (file) => file instanceof File
    )

    return filesArray.length > 0 ? filesArray : []
  }

  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      description: formState.description,
      files: getAttachments(),
    },
  })
  const { register, setFocus } = form

  const { description } = form.watch()

  useEffect(() => {
    const debouncedWatch = debounce(async (value) => {
      if (value) {
        const { main, sub } = await getCategoryForDescription(value)

        updateForm({
          ...formState,
          main_category: main,
          sub_category: sub,
        })
      }
    }, 500)

    debouncedWatch(description)

    return () => {
      debouncedWatch.cancel()
    }
  }, [description])

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    updateForm({
      ...formState,
      description: values.description,
      attachments: values.files,
    })

    setLastCompletedStep(1)
    addOneStep()

    router.push('/incident/add')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const filesArray = form
        .getValues('files')
        .concat(Array.from(files))
        .slice(0, MAX_NUMBER_FILES)
      form.setValue('files', filesArray)
    }
  }

  const deleteFile = (index: number) => {
    const updatedFiles = form.getValues('files').filter((_, i) => i !== index)
    form.setValue('files', updatedFiles)
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
            <FormFieldTextarea
              rows={5}
              description={t('describe_textarea_description')}
              label={t('describe_textarea_heading')}
              errorMessage={errors.description?.message}
              invalid={Boolean(errors.description?.message)}
              {...field}
            />
          )}
        />

        <FormField
          name={'files'}
          control={form.control}
          render={({ formState: { errors } }) => (
            <FormItem error={errors.description}>
              <div>
                <Label onClick={() => setFocus('files')}>{t('describe_upload_heading')}</Label>
                <FormDescription>
                  {t('describe_upload_description')}
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl>
                {/*@ts-ignore*/}
                <FileUpload
                  onFileUpload={(e) => handleFileChange(e)}
                  onDelete={(index) => deleteFile(index)}
                  files={form.getValues('files')}
                  {...register('files', { required: false })}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <IncidentFormFooter />
      </form>
    </Form>
  )
}
