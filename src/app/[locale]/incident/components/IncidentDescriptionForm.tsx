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
import { Input } from '@/components/ui/Input'
import { useTranslations } from 'next-intl'

export const IncidentDescriptionForm = () => {
  const t = useTranslations('describe-report.form')

  const incidentDescriptionFormSchema = z.object({
    title: z.string().min(1, t('errors.textarea_required')),
  })

  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      title: '',
    },
  })

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name={'title'}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>{t('describe_textarea_heading')}</FormLabel>
                <FormDescription>
                  {t('describe_textarea_description')}
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder={'title'} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <button type="submit">{t('describe_submit')}</button>
      </form>
    </Form>
  )
}
