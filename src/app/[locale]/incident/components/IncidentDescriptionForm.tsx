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
import { Textarea } from '@/components/ui/TextArea'

export const IncidentDescriptionForm = () => {
  const t = useTranslations('describe-report.form')

  const incidentDescriptionFormSchema = z.object({
    description: z.string().min(1, t('errors.textarea_required')),
  })

  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      description: '',
    },
  })

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-start"
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
        <button type="submit">{t('describe_submit')}</button>
      </form>
    </Form>
  )
}
