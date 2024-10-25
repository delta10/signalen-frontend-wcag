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
import { useStepperStore } from '@/store/stepper_store'
import { useRouter } from '@/routing/navigation'
import { useEffect } from 'react'
import { getCategoryForDescription } from '@/services/classification'
import { debounce } from 'lodash'
import { useFormStore } from '@/store/form_store'
import React from 'react'
import {
  ACCEPTED_IMAGE_TYPES,
  FileUpload,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from '@/components/ui/upload/FileUpload'

export const IncidentDescriptionForm = () => {
  const t = useTranslations('describe-report.form')
  const { updateForm, formState } = useFormStore()
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()

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

  // todo: kijken of dit netter kan
  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      description: formState.description,
      files: getAttachments(),
    },
  })

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

  // @ts-ignore
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

              <FormControl>
                {/*<FileInput value={images} onChange={handleChange}

                  1. verplaats naar aparte file [x]
                  2. kijk of via form values kan [x]
                  3. zorg dat preview, empty boxes en upload knop werken [x]
                  4. maak delete knop op preview [x]
                  5. voeg preview toe aan summary [x]
                  6. check toetsenboard controls pt1.[x] pt2.[]
                  7. check overige toegankelijkheid []
                  8. op de een of andere manier worden de files niet goed bewaard bij een refresh [x] --> weggoien
                  9. op dit moment wordt de hele array vervangen [x]
                  10. ipv form naar upload component alleen een methode passen daarin de update uitvoeren -> makkelijker hergebruik
                  11. form validatie eerder triggeren []
                  12. verschillende screen sizes
                  13. max 5 items en description aanpassen [x]

                  vraag:
                  - wat doen bij overschrijden max aantal files?
                  todo: gebruik tw read onl
                  todo: zorg dat file plussen ook werkt
                  />*/}
                {/*@ts-ignore*/}
                <FileUpload form={form} />
              </FormControl>
            </FormItem>
          )}
        />
        <IncidentFormFooter />
      </form>
    </Form>
  )
}
